"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const fs = require("fs");
const path = require("path");
const server = http.createServer((req, res) => {
    let filePath = req.url === "/" ? "index.html" : req.url.substring(1); // Remove leading "/"
    const fullPath = path.join(__dirname, filePath);
    // Determine MIME type
    const mimeType = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
    };
    const ext = path.extname(filePath);
    const contentType = mimeType[ext] || "application/octet-stream";
    // Serve the file
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
        }
        else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });
});
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
