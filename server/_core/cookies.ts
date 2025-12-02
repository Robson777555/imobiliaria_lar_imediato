import type { CookieOptions, Request } from "express";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  const hostname = req.hostname;
  const isLocalhost = !hostname || LOCAL_HOSTS.has(hostname) || isIpAddress(hostname);
  const isSecure = isSecureRequest(req);
  
  // CRITICAL FIX: In production (HTTPS), we MUST use SameSite=None and Secure=true
  // for cookies to work across different subdomains or when frontend/backend are on different domains
  // This is required for Vercel/Netlify deployments
  let sameSite: "lax" | "none" = "lax";
  let secure = false;
  
  if (isSecure) {
    // In HTTPS (production), use SameSite=None and Secure=true
    sameSite = "none";
    secure = true;
  } else if (isLocalhost) {
    // In localhost (development), use SameSite=Lax and Secure=false
    sameSite = "lax";
    secure = false;
  } else {
    // Fallback for other cases
    sameSite = "lax";
    secure = isSecure;
  }

  console.log(`[Cookie Config] hostname: ${hostname}, isLocalhost: ${isLocalhost}, isSecure: ${isSecure}, sameSite: ${sameSite}, secure: ${secure}`);

  return {
    httpOnly: true,
    path: "/",
    sameSite,
    secure,
  };
}
