import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

const demoDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(demoDir, "..");
const port = process.env.PORT ? Number(process.env.PORT) : 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (urlPath === "/") urlPath = "/demo/index.html";

  // only ever serve the demo page/script and the built library output
  if (!urlPath.startsWith("/demo/") && !urlPath.startsWith("/dist/")) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  const filePath = path.join(projectRoot, urlPath);
  if (!filePath.startsWith(projectRoot)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`8bot demo running at ${url}`);
  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${opener} ${url}`, () => {});
});
