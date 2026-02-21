import { toNextJsHandler } from "better-auth/next-js";
import arcjet, {
  BotOptions,
  detectBot,
  EmailOptions,
  protectSignup,
  shield,
  slidingWindow,
  SlidingWindowRateLimitOptions,
} from "@arcjet/next";
import { findIp } from "@arcjet/ip";
// import { isSpoofedBot } from "@arcjet/inspect";

import { auth } from "@/lib/auth";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userIdOrIp"],
  rules: [shield({ mode: "LIVE" })],
});

const botSettings = { mode: "LIVE", allow: [] } satisfies BotOptions;

const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 10,
  interval: "10m",
} as SlidingWindowRateLimitOptions<[]>;

const laxRateLimitSettings = {
  mode: "LIVE",
  max: 60,
  interval: "1m",
} as SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: "LIVE",
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

async function checkArcjet(request: Request) {
  const pathname = new URL(request.url).pathname;
  const body = (await request.json()) as unknown;

  const session = await auth.api.getSession({ headers: request.headers });
  const userIdOrIp = (session?.user.id ?? findIp(request)) || "120.0.0.1"; // findIp only works in prod

  const probe = new Request(request.url, {
    method: request.method,
    headers: request.headers,
  });

  if (pathname.endsWith("/auth/sign-up")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          }),
        )
        .protect(probe, { email: body.email, userIdOrIp });
      // .protect(request, { email: body.email, userIdOrIp }); // some how this giving error ❌
    } else {
      return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(probe, { userIdOrIp }); // here we are not since checking email for emai based checks 👲 so don't pass
      // .protect(request, { userIdOrIp }) ❌
    }
  }

  // not on any auth related page - so for now use more generic return
  // const probe = new Request(request.url, { method: request.method, headers: request.headers });
  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(probe, { userIdOrIp });
  // .protect(request, { userIdOrIp });
}

// ==========================================================================================

// export const { POST, GET } = toNextJsHandler(auth);
export const authHandlers = toNextJsHandler(auth);

// as we need to only protect and limit post request in auth, so no need to change in GET handlers
export const { GET } = authHandlers;

export async function POST(request: Request) {
  const arcjetRequest = request.clone();
  const authRequest = request.clone();
  // as better-auth also read the body of request obj at the same time and you can't have two things reading same req object - so clone req obj for better-auth to read after arcjet used
  const decision = await checkArcjet(arcjetRequest);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 });
    } else if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid.";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Email domain is not valid.";
      } else {
        message = "Invalid email.";
      }

      return Response.json({ message }, { status: 400 });
    } else {
      return new Response(null, { status: 403 });
    }
  }

  return authHandlers.POST(authRequest); // 🚨
}
