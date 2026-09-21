import {
  createClient,
  getPublicDeploymentStats,
  submitContactRequest,
  registerFeatureInterest,
  getFeatureInterests,
} from "@ohmyhost/sdk-ts";
export interface PublicControlBinding {
  fetch(request: Request): Promise<Response>;
}

export function publicApiClient(binding: PublicControlBinding, request: Request) {
  return createClient({
    baseUrl: "https://app.ohmyho.st",
    throwOnError: true,
    fetch: async (input, init) => {
      const forwarded = new Request(input, init);
      const ip = request.headers.get("cf-connecting-ip");
      if (ip) forwarded.headers.set("cf-connecting-ip", ip);
      forwarded.headers.set("origin", "https://ohmyho.st");
      const response = await binding.fetch(
        new Request(forwarded, {
          signal: AbortSignal.any([forwarded.signal, AbortSignal.timeout(15000)]),
        }),
      );
      if (response.status === 429) {
        const value = response.headers.get("retry-after");
        const retryAfterSeconds =
          value !== null && /^\d{1,5}$/u.test(value) && Number(value) > 0 && Number(value) <= 86400
            ? Number(value)
            : 60;
        throw Object.assign(new Error("Public request rate limited"), {
          status: 429,
          retryAfterSeconds,
        });
      }
      return response;
    },
  });
}
/** Signup is open; a single bounded r value is acquisition attribution, never an access gate. */
export function signupSource(source: string | undefined): string | undefined {
  return source !== undefined && /^[^\p{Cc}]{1,64}$/u.test(source) ? source : undefined;
}
export async function siteRequestResponse(
  request: Request,
  binding?: PublicControlBinding,
): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (!["/v1/contact-requests", "/want", "/stats.json", "/status.json"].includes(path)) return null;
  const json = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: { "cache-control": "no-store" } });
  if (
    (path === "/stats.json" || path === "/status.json") &&
    !["GET", "HEAD"].includes(request.method)
  )
    return json({ code: "invalid_request" }, 405);
  if (!binding) return json({ code: "service_unavailable" }, 503);
  try {
    const client = publicApiClient(binding, request);
    const voteCookie = readVoteCookie(request);
    if (path === "/want" && request.method === "GET") {
      const origin = request.headers.get("origin");
      if (origin !== null && origin !== "https://ohmyho.st")
        return json({ code: "forbidden" }, 403);
      const voter = voteCookie ?? crypto.randomUUID();
      const response = json(
        validateVoteState(await getFeatureInterests({ "X-Ohmyho-Voter": voter }, { client })),
      );
      response.headers.set("set-cookie", voteCookieHeader(voter));
      return response;
    }
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
    if (Object.keys(input).sort().join(",") !== "choice,feature,idempotency_key")
      return json({ code: "invalid_request" }, 400);
    if (voteCookie === null) return json({ code: "voter_cookie_required" }, 409);
    const result = await registerFeatureInterest(
      {
        ...(input as Omit<Parameters<typeof registerFeatureInterest>[0], "X-Ohmyho-Voter">),
        "X-Ohmyho-Voter": voteCookie,
      },
      { client },
    );
    if (
      !result ||
      Object.keys(result).sort().join(",") !== "accepted,votes" ||
      result.accepted !== true
    )
      throw new Error("Invalid vote receipt");
    const response = json({ accepted: true, ...validateVoteState({ votes: result.votes }) }, 202);
    response.headers.set("set-cookie", voteCookieHeader(voteCookie));
    return response;
  } catch (error) {
    const status =
      error &&
      typeof error === "object" &&
      "status" in error &&
      typeof error.status === "number" &&
      [400, 403, 409, 413, 429].includes(error.status)
        ? error.status
        : 503;
    const response = json(
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
    if (status === 429) {
      const seconds =
        error &&
        typeof error === "object" &&
        "retryAfterSeconds" in error &&
        typeof error.retryAfterSeconds === "number"
          ? error.retryAfterSeconds
          : 60;
      response.headers.set("retry-after", String(seconds));
    }
    return response;
  }
}

function readVoteCookie(request: Request): string | null {
  const values = (request.headers.get("cookie") ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.startsWith("__Host-omh_voter="));
  if (values.length !== 1) return null;
  const value = values[0]?.slice("__Host-omh_voter=".length);
  return value !== undefined &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(value)
    ? value.toLowerCase()
    : null;
}
function voteCookieHeader(voter: string): string {
  return `__Host-omh_voter=${voter}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000`;
}
function validateVoteState(value: unknown): {
  votes: { feature: string; choice: "up" | "down" | null }[];
} {
  if (
    !value ||
    typeof value !== "object" ||
    Object.keys(value).join(",") !== "votes" ||
    !("votes" in value) ||
    !Array.isArray(value.votes) ||
    value.votes.length !== 3
  )
    throw new Error("Invalid vote state");
  const seen = new Set<string>();
  const votes = value.votes.map((vote: unknown) => {
    if (
      !vote ||
      typeof vote !== "object" ||
      Object.keys(vote).sort().join(",") !== "choice,feature" ||
      !("feature" in vote) ||
      typeof vote.feature !== "string" ||
      !["eu", "iso27001", "soc2"].includes(vote.feature) ||
      seen.has(vote.feature) ||
      !("choice" in vote) ||
      ![null, "up", "down"].includes(vote.choice as null | string)
    )
      throw new Error("Invalid vote choice");
    seen.add(vote.feature);
    return { feature: vote.feature, choice: vote.choice as "up" | "down" | null };
  });
  return { votes };
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
