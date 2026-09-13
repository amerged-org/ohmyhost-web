import {
  createClient,
  getBetaEligibility,
  getPublicDeploymentStats,
  registerBetaInterest,
  submitContactRequest,
  registerFeatureInterest,
} from "@ohmyhost/sdk-ts";
export interface PublicControlBinding {
  fetch(request: Request): Promise<Response>;
}

export function betaClient(binding: PublicControlBinding, request: Request) {
  return createClient({
    baseUrl: "https://app.ohmyho.st",
    throwOnError: true,
    fetch: async (input, init) => {
      const forwarded = new Request(input, init);
      const ip = request.headers.get("cf-connecting-ip");
      if (ip) forwarded.headers.set("cf-connecting-ip", ip);
      forwarded.headers.set("origin", "https://ohmyho.st");
      return binding.fetch(
        new Request(forwarded, {
          signal: AbortSignal.any([forwarded.signal, AbortSignal.timeout(15000)]),
        }),
      );
    },
  });
}
export async function eligibleSource(
  source: string | undefined,
  binding: PublicControlBinding | undefined,
  request: Request,
): Promise<string | undefined> {
  if (!source || !binding) return undefined;
  const result = await getBetaEligibility({ r: source }, { client: betaClient(binding, request) });
  if (
    !result ||
    Object.keys(result).join(",") !== "eligible" ||
    typeof result.eligible !== "boolean"
  )
    throw new Error("Invalid eligibility response");
  return result.eligible === true ? source : undefined;
}
export async function siteBetaResponse(
  request: Request,
  binding?: PublicControlBinding,
): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (
    ![
      "/v1/beta/interests",
      "/v1/contact-requests",
      "/want",
      "/stats.json",
      "/status.json",
    ].includes(path)
  )
    return null;
  const json = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: { "cache-control": "no-store" } });
  if (
    (path === "/stats.json" || path === "/status.json") &&
    !["GET", "HEAD"].includes(request.method)
  )
    return json({ code: "invalid_request" }, 405);
  if (!binding) return json({ code: "service_unavailable" }, 503);
  try {
    const client = betaClient(binding, request);
    if (path === "/stats.json" && ["GET", "HEAD"].includes(request.method))
      return json(validateStats(await getPublicDeploymentStats({ client })));
    if (path === "/status.json" && ["GET", "HEAD"].includes(request.method)) {
      const stats = validateStats(await getPublicDeploymentStats({ client }));
      return json({
        ok: false,
        observed_at: stats.observed_at,
        components: [
          { name: "API and reporting", status: "operational" },
          { name: "Hosting", status: "not_observed" },
          { name: "Customer databases", status: "not_observed" },
          { name: "Email", status: "not_observed" },
          { name: "Billing", status: "not_observed" },
          { name: "MCP", status: "local_client" },
        ],
        description:
          "API and reporting responded. This check does not establish every service's availability.",
      });
    }
    if (request.method !== "POST") return json({ code: "invalid_request" }, 405);
    if (request.headers.get("origin") !== "https://ohmyho.st")
      return json({ code: "forbidden" }, 403);
    if (request.headers.get("content-type")?.split(";", 1)[0]?.trim() !== "application/json")
      return json({ code: "invalid_request" }, 400);
    const maxBytes = path === "/v1/contact-requests" ? 32768 : 2048;
    const reader = request.body?.getReader();
    if (!reader) return json({ code: "invalid_request" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      for (;;) {
        const next = await reader.read();
        if (next.done) break;
        size += next.value.length;
        if (size > maxBytes) {
          await reader.cancel();
          return json({ code: "payload_too_large" }, 413);
        }
        chunks.push(next.value);
      }
    } finally {
      reader.releaseLock();
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    let body: unknown;
    try {
      body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    } catch {
      return json({ code: "invalid_request" }, 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      return json({ code: "invalid_request" }, 400);
    const input = body as Record<string, unknown>;
    if (path === "/v1/contact-requests") {
      if (Object.keys(input).sort().join(",") !== "company,email,idempotency_key,message,name")
        return json({ code: "invalid_request" }, 400);
      return json(
        validateAcceptance(
          await submitContactRequest(input as Parameters<typeof submitContactRequest>[0], {
            client,
          }),
        ),
        202,
      );
    }
    if (path === "/want") {
      if (Object.keys(input).sort().join(",") !== "feature,idempotency_key")
        return json({ code: "invalid_request" }, 400);
      return json(
        validateAcceptance(
          await registerFeatureInterest(input as Parameters<typeof registerFeatureInterest>[0], {
            client,
          }),
        ),
        202,
      );
    }
    if (Object.keys(input).sort().join(",") !== "consent,consent_version,email")
      return json({ code: "invalid_request" }, 400);
    return json(
      validateAcceptance(
        await registerBetaInterest(input as Parameters<typeof registerBetaInterest>[0], { client }),
      ),
      202,
    );
  } catch (error) {
    const status =
      error &&
      typeof error === "object" &&
      "status" in error &&
      typeof error.status === "number" &&
      [400, 403, 409, 413, 429].includes(error.status)
        ? error.status
        : 503;
    return json(
      {
        code:
          status === 503
            ? "service_unavailable"
            : status === 429
              ? "rate_limited"
              : "invalid_request",
      },
      status,
    );
  }
}

function validateAcceptance(value: unknown): { accepted: true } {
  if (
    !value ||
    typeof value !== "object" ||
    Object.keys(value).join(",") !== "accepted" ||
    !("accepted" in value) ||
    value.accepted !== true
  )
    throw new Error("Invalid interest receipt");
  return { accepted: true };
}
function validateStats(value: unknown): { deploys_7d: number; observed_at: string } {
  if (
    !value ||
    typeof value !== "object" ||
    Object.keys(value).sort().join(",") !== "deploys_7d,observed_at" ||
    !("deploys_7d" in value) ||
    typeof value.deploys_7d !== "number" ||
    !Number.isSafeInteger(value.deploys_7d) ||
    value.deploys_7d < 0 ||
    !("observed_at" in value) ||
    typeof value.observed_at !== "string" ||
    !Number.isFinite(Date.parse(value.observed_at)) ||
    new Date(value.observed_at).toISOString() !== value.observed_at
  )
    throw new Error("Invalid public statistics");
  return { deploys_7d: value.deploys_7d, observed_at: value.observed_at };
}
