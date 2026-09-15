#!/usr/bin/env node

import { pathToFileURL } from "node:url";

const SURFACES = new Map([
  ["reel", "reel"],
  ["reels", "reel"],
  ["p", "feed-post"],
  ["tv", "igtv"],
]);

const SHORTCODE = /^[A-Za-z0-9_-]+$/;

export function classifyInstagramUrl(input) {
  if (typeof input !== "string" || input.trim() === "") {
    return { valid: false, error: "EMPTY_INPUT" };
  }

  let url;
  try {
    url = new URL(input.trim());
  } catch {
    return { valid: false, error: "INVALID_URL" };
  }

  if (url.protocol !== "https:") {
    return { valid: false, error: "HTTPS_REQUIRED" };
  }

  if (url.username || url.password || url.port) {
    return { valid: false, error: "CREDENTIALS_OR_PORT_NOT_ALLOWED" };
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname !== "instagram.com" && hostname !== "www.instagram.com") {
    return { valid: false, error: "UNSUPPORTED_HOST" };
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const surface = segments[0]?.toLowerCase();
  const shortcode = segments[1];
  const contentType = SURFACES.get(surface);

  if (!contentType || !shortcode || !SHORTCODE.test(shortcode) || segments.length !== 2) {
    return { valid: false, error: "UNSUPPORTED_PATH" };
  }

  const canonicalSurface = contentType === "reel" ? "reel" : surface;
  return {
    valid: true,
    contentType,
    normalizedUrl: `https://www.instagram.com/${canonicalSurface}/${shortcode}/`,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = classifyInstagramUrl(process.argv[2]);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.valid) process.exitCode = 1;
}
