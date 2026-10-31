// Tiny local server (no dependencies): serves index.html and runs api/trial.js.
// Usage: node dev-server.js   (reads LLM_API_KEY and MODEL_NAME from .env)
const http = require("http");
const fs = require("fs");
const path = require("path");

try {
  fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith("#") && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  });
} catch (e) {}

const handler = require("./api/trial.js");

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  if (url === "/api/trial") {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try { req.body = raw ? JSON.parse(raw) : undefined; } catch (e) { req.body = raw; }
      res.status = (c) => { res.statusCode = c; return res; };
      res.json = (o) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
      handler(req, res).catch((e) => { console.error(e); res.status(500).json({ error: "Server error." }); });
    });
    return;
  }
  if (url === "/" || url === "/index.html") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.end(fs.readFileSync(path.join(__dirname, "index.html")));
  }
  res.statusCode = 404;
  res.end("Not found");
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Ramble Court running at http://localhost:${port}`);
    if (!process.env.LLM_API_KEY || !process.env.MODEL_NAME) {
      console.log("Warning: LLM_API_KEY or MODEL_NAME is not set. Only the example verdict will work.");
    }
  });
}
module.exports = server;
