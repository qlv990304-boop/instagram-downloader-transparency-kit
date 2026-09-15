import assert from "node:assert/strict";
import test from "node:test";
import { classifyInstagramUrl } from "../bin/classify-instagram-url.mjs";

test("classifies and normalizes Reel URLs", () => {
  assert.deepEqual(classifyInstagramUrl("https://instagram.com/reels/ABC_123/?utm_source=test"), {
    valid: true,
    contentType: "reel",
    normalizedUrl: "https://www.instagram.com/reel/ABC_123/",
  });
});

test("classifies feed-video post URLs", () => {
  assert.equal(classifyInstagramUrl("https://www.instagram.com/p/Abc-123/").contentType, "feed-post");
});

test("classifies IGTV URLs", () => {
  assert.equal(classifyInstagramUrl("https://www.instagram.com/tv/Abc123/").contentType, "igtv");
});

test("rejects non-HTTPS URLs", () => {
  assert.equal(classifyInstagramUrl("http://instagram.com/reel/ABC/").error, "HTTPS_REQUIRED");
});

test("rejects alternate hosts", () => {
  assert.equal(classifyInstagramUrl("https://example.com/reel/ABC/").error, "UNSUPPORTED_HOST");
});

test("rejects credentials and alternate ports", () => {
  assert.equal(classifyInstagramUrl("https://name:pass@instagram.com/reel/ABC/").error, "CREDENTIALS_OR_PORT_NOT_ALLOWED");
  assert.equal(classifyInstagramUrl("https://instagram.com:444/reel/ABC/").error, "CREDENTIALS_OR_PORT_NOT_ALLOWED");
});

test("rejects profiles, Stories, and incomplete paths", () => {
  assert.equal(classifyInstagramUrl("https://instagram.com/nasa/").error, "UNSUPPORTED_PATH");
  assert.equal(classifyInstagramUrl("https://instagram.com/stories/nasa/123/").error, "UNSUPPORTED_PATH");
  assert.equal(classifyInstagramUrl("https://instagram.com/reel/").error, "UNSUPPORTED_PATH");
});

test("rejects empty or malformed input", () => {
  assert.equal(classifyInstagramUrl(" " ).error, "EMPTY_INPUT");
  assert.equal(classifyInstagramUrl("not a url").error, "INVALID_URL");
});
