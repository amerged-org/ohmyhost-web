# Run Your Own Container Jobs for PDFs and Image Processing

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · November 26, 2026

Starting with **ohmyho.st `0.1.84`**, Paid workspaces can build a Dockerfile from their saved project revision and run finite offline Linux container jobs directly alongside their hosted web app. Convert uploaded photos to PDF, optimize JPEGs and PDFs with Pillow or Poppler, cap every run's runtime and microcredit spend, and download outputs after exit without operating a second host.

Most web applications live comfortably inside an HTTP runtime until one feature asks for real Linux binaries. A customer uploads twelve phone photos and expects one clean, print-ready PDF. A finance portal needs to compress multi-page scanned PDFs before archiving them. A real-estate listing app wants to strip EXIF metadata, resize JPEGs, and generate thumbnails with Pillow or ImageMagick. A back-office tool needs `poppler-utils`, `qpdf`, or a specific Python wheel that does not run in a JavaScript isolate.

Until now, hitting that single requirement usually meant bolting a second platform onto your stack: a separate container host, another billing account, a queue, a bucket with cross-account IAM policies, and custom webhook glue just to move one private file in and one processed PDF back out.

## Why finite container jobs instead of a second always-on service

Document and media processing is bursty by nature. A small SaaS app might process forty PDF conversions on Monday morning and zero at three in the morning. Keeping a warm container server running all month wastes money and introduces operational surface you did not ask for: long-lived container state, memory leaks between customers, secret sprawl, and idle base fees.

Project-owned container jobs on ohmyho.st follow a different model:

- **One repository, one revision.** Your `Dockerfile`, pinned dependencies, and entrypoint script live in a directory inside the same project you already deploy.
- **Immutable built versions.** You build and publish a named job version once from an exact saved source revision. Every subsequent run pins that `version_id` and its container digest.
- **Fresh offline instance per run.** Each job run starts a clean container instance with private scratch storage and **no public internet access**. All Python wheels, npm packages, or native Linux packages are installed once at build time.
- **Bounded runtime, size, and spend.** The initial profile supports up to **60 seconds** per run, **16 input files**, **16 output files**, **64 MiB of input**, and **64 MiB of output**. Before a run starts, you request a quote and authorize an explicit microcredit cap.
- **Private file handoff.** Input bytes and output bytes transfer through short-lived scoped URLs rather than bloating JSON payloads or leaking public object links.

If you only need to turn an HTML invoice or report into a PDF, the managed [browser PDF service](https://docs.ohmyho.st/browser-pdf) is still the lighter choice. Reach for a container job when you need native Linux codecs, Python imaging libraries, custom PDF manipulation, or deterministic command-line pipelines that belong under your own Dockerfile.

## Anatomy of a container job: photo-to-PDF and JPEG optimization

A container job has a small, predictable filesystem contract. When the runtime starts your program, it appends two arguments to the `entrypoint` array you declared at publish time:

1. The absolute path to `manifest.json` inside the private input directory.
2. The absolute path to the empty output directory.

`manifest.json` contains an ordered `inputs` array (each entry gives a relative `path` resolved next to `manifest.json`) and an optional `parameters` JSON object. Your program reads the input files, writes its regular output files directly into the output directory (one directory level deep), and writes an `outputs.json` file listing each output's `path`, `media_type`, and exact `size_bytes`.

Here is a complete Python 3.12 + Pillow job (`jobs/photo-pdf/Dockerfile` and `jobs/photo-pdf/convert.py`) that turns uploaded images into both a multi-page `report.pdf` and an optimized `optimized.jpg`:

```dockerfile
FROM python:3.12-slim
RUN pip install --no-cache-dir pillow==11.1.0
WORKDIR /app
COPY convert.py /app/convert.py
```

```python
import json
import os
import sys
from PIL import Image

manifest_path = sys.argv[1]
out_dir = sys.argv[2]
in_dir = os.path.dirname(manifest_path)

with open(manifest_path, "r", encoding="utf-8") as handle:
    manifest = json.load(handle)

images = []
for item in manifest.get("inputs", []):
    source_path = os.path.join(in_dir, item["path"])
    images.append(Image.open(source_path).convert("RGB"))

if not images:
    raise RuntimeError("At least one input image is required")

pdf_path = os.path.join(out_dir, "report.pdf")
images[0].save(pdf_path, "PDF", save_all=True, append_images=images[1:])

jpg_path = os.path.join(out_dir, "optimized.jpg")
images[0].save(jpg_path, "JPEG", quality=75, optimize=True)

outputs = [
    {
        "path": "report.pdf",
        "media_type": "application/pdf",
        "size_bytes": os.path.getsize(pdf_path),
    },
    {
        "path": "optimized.jpg",
        "media_type": "image/jpeg",
        "size_bytes": os.path.getsize(jpg_path),
    },
]

with open(os.path.join(out_dir, "outputs.json"), "w", encoding="utf-8") as handle:
    json.dump({"outputs": outputs}, handle)
```

Notice how portable that script is. It imports nothing specific to ohmyho.st. You can test `python3 convert.py ./tmp/manifest.json ./tmp/out` locally on your laptop with ordinary files before publishing a single byte.

Prefer Node.js over Python? The exact same contract works with a pinned `node:22-alpine` image, `package-lock.json`, and libraries such as `pdf-lib` or `sharp`. You control the base image, system packages, and versions.

## Publish once, then run from your deployed backend

Publishing a new image version belongs to the project developer or your coding agent through the authenticated REST API, TypeScript SDK, MCP tools (`container_job_version_publish` / `container_job_version_get`), or `ohmyhost job publish`. Each environment supports up to nine named jobs and keeps a tenth version slot reserved so updates can build and verify before switching without interrupting active runs.

Once a version reaches `ready`, your deployed web application can submit runs, poll status, cancel active work, and retrieve output files directly from server-side code.

Add the environment's Jobs gateway origin to `runtime.egress.allow` in `ohmyhost.yaml`:

```yaml
version: 1
project: photo-desk
runtime:
  mode: functions
  healthcheck: /health
  egress:
    allow:
      - https://jobs.ohmyho.st
```

Use `https://jobs.dev.ohmyho.st` in Development and `https://jobs.ohmyho.st` in Production. When you deploy an app whose egress allowlist includes the Jobs gateway origin, ohmyho.st automatically:

- Permits the matching private file-transfer host (`https://job-files.ohmyho.st` in Production, `https://job-files.dev.ohmyho.st` in Development) so you do not have to configure a second host.
- Injects `OHMYHOST_JOBS_BASE_URL` and a deployment-scoped `OHMYHOST_JOBS_TOKEN` secret into your runtime environment.

Keep `OHMYHOST_JOBS_TOKEN` strictly on the server. Your application decides which signed-in end users may trigger conversions, validates input sizes and types, and calls the Jobs gateway with `Authorization: Bearer ${env.OHMYHOST_JOBS_TOKEN}`:

```js
async function submitPhotoPdfJob(env, { versionId, pngBytes, idempotencyKey, acceptedMicros }) {
  const auth = { Authorization: `Bearer ${env.OHMYHOST_JOBS_TOKEN}` };

  // 1. Request a short-lived upload grant and PUT the private bytes.
  const grantRes = await fetch(new URL("/v1/job-inputs", env.OHMYHOST_JOBS_BASE_URL), {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: "input",
      size_bytes: pngBytes.byteLength,
      media_type: "image/png",
    }),
  });
  if (grantRes.ok === false) throw new Error(`Upload grant failed (${grantRes.status})`);
  const grant = await grantRes.json();

  const putRes = await fetch(grant.url, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: pngBytes,
  });
  if (putRes.ok === false) throw new Error(`Input upload failed (${putRes.status})`);

  // 2. Request a quote for the pinned version and check the cap.
  const quoteRes = await fetch(new URL("/v1/job-quotes", env.OHMYHOST_JOBS_BASE_URL), {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      version_id: versionId,
      input_refs: [grant.file_id],
      max_runtime_seconds: 60,
    }),
  });
  if (quoteRes.ok === false) throw new Error(`Quote failed (${quoteRes.status})`);
  const quote = await quoteRes.json();

  if (BigInt(quote.max_credit_micros) > BigInt(acceptedMicros)) {
    throw new Error("Quoted maximum exceeds the approved credit cap");
  }

  // 3. Start the run with a stable idempotency key.
  const startRes = await fetch(new URL("/v1/job-runs", env.OHMYHOST_JOBS_BASE_URL), {
    method: "POST",
    headers: {
      ...auth,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      quote_id: quote.quote_id,
      max_credit_micros: String(acceptedMicros),
    }),
  });
  if (startRes.ok === false) throw new Error(`Start failed (${startRes.status})`);
  return startRes.json();
}
```

Retrying `/v1/job-runs` with the same `Idempotency-Key` and payload returns the existing `run_id` rather than double-charging or starting a duplicate container. After starting, poll `GET ${env.OHMYHOST_JOBS_BASE_URL}/v1/job-runs/${run_id}` until `state` reaches `succeeded`. Then call `POST /v1/job-runs/${run_id}/outputs/${file_id}/download` to receive a short-lived transfer URL and stream the generated PDF or JPEG back to your user or save it into durable [private project files](https://docs.ohmyho.st/files). Temporary job files expire after 24 hours.

If a user cancels an upload or navigates away from a long batch, call `POST /v1/job-runs/${run_id}/cancel` to stop the queued or active run cleanly.

## Pricing, credit caps, and honest placement boundaries

Container jobs draw from the same workspace credit balance as the rest of your ohmyho.st projects and respect each project's monthly Stop budget. There is no separate container subscription.

- **Measured-time billing:** A 60-second Basic run reserves `153,378` microcredits (`1` credit = `1,000,000` microcredits). When a run finishes in 12 measured seconds, the settled charge is `30,676` microcredits and the unused reservation is immediately released back to your balance.
- **Real example from our acceptance tests:** A Python 3.12 + Pillow job converting an uploaded PNG into both a `%PDF-1.4` document and an optimized JPEG settled at roughly `6,000` to `18,000` microcredits per run (well under two hundredths of a single credit).
- **Safe cancellation and fault handling:** Cancelling before execution releases the entire hold. Cancelling an active run settles only the measured time up to cutoff. Platform infrastructure faults release the customer's reservation.
- **Placement transparency:** Both US and EU projects on Paid workspaces can use private container jobs, with tenant-scoped storage and isolated runs. Jobs execute on Cloudflare container infrastructure, so container jobs **do not** carry an end-to-end EU data residency guarantee. Check the [pricing page](/pricing) and [container jobs guide](https://docs.ohmyho.st/container-jobs) before routing regulated documents through a container job.

## Ask your coding agent to add one to your project

Because the OpenAPI contract, TypeScript SDK, CLI (`ohmyhost job`), and agent Skills all ship together in `0.1.84`, you can ask your coding agent to wire up a complete container job directly inside your existing project:

```text
Inspect my ohmyho.st project and add a project-owned container job under
jobs/photo-pdf using Python 3.12 and Pillow that converts uploaded images
into a single PDF and an optimized JPEG. Verify the Dockerfile and script
locally first, explain the required ohmyhost.yaml egress allowlist entry,
and show me the publish and test steps before deploying to Production.
```

Read the complete specification and operational limits in the [Container Jobs documentation](https://docs.ohmyho.st/container-jobs), review rates on [Pricing](/pricing), or check [Project budgets](https://docs.ohmyho.st/budgets) to set monthly spend caps before enabling high-volume document processing.
