// Passcode gate for the B Safe at Spring Break attendee page and its files.
// The passcode lives in the Netlify environment variable ATTENDEE_PASSCODE,
// never in this repository. If the variable is missing, access is denied.
import type { Context } from "https://edge.netlify.com";

const HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  "Cache-Control": "private, no-store",
};

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export default async (request: Request, context: Context) => {
  const passcode = Netlify.env.get("ATTENDEE_PASSCODE");
  if (!passcode) {
    return new Response("Unavailable", { status: 503, headers: HEADERS });
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const given = decoded.slice(decoded.indexOf(":") + 1);
      if (safeEqual(given, passcode)) {
        const response = await context.next();
        for (const [k, v] of Object.entries(HEADERS)) response.headers.set(k, v);
        return response;
      }
    } catch (_) {
      // fall through to the challenge
    }
  }
  return new Response("Attendee passcode required.", {
    status: 401,
    headers: {
      ...HEADERS,
      "WWW-Authenticate": 'Basic realm="B Safe at Spring Break Attendees", charset="UTF-8"',
    },
  });
};

export const config = {
  path: ["/attendee-resources-x7k2m9", "/attendee-resources-x7k2m9/*"],
};
