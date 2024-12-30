import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { transformSync } from "esbuild";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

import RenderHtmlPage from "./utils/renderHtml";

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const filePath = req.url === "/" ? "index.html" : req.url!.substring(1);
    const fullPath = path.join(__dirname, filePath);

    const mimeType: Record<string, string> = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".ts": "application/javascript", // load transpiled TypeScript as JavaScript ඞ
    };
    const ext = path.extname(filePath);
    const contentType = mimeType[ext] || "application/octet-stream";

    // Serve static files (CSS, JS, PNG, JPG),  transpile TypeScript files on the fly, render index.html
    if ([".css", ".js", ".png", ".jpg"].includes(ext)) {
        fs.readFile(fullPath, (err, data) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
            }
        });
    }
    else if (ext === ".ts") {
        try {
            const tsContent = fs.readFileSync(fullPath, "utf-8");
            const transpiledCode = transformSync(tsContent, {
                loader: "ts",
                target: "es6",
                format: "esm",
            }).code;

            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(transpiledCode);
        } catch (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error transpiling TypeScript file");
            console.error(err);
        }
    }
    else if (filePath === "index.html") {
        const html = new RenderHtmlPage("web-games");
        html.setDescription("Games made for fun");

        const appPath = `app/index.js`;
        html.addScript(appPath);

        const htmlContent = html.renderLayout();

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlContent);
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
