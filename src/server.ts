import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { transformSync } from "esbuild";
import * as dotenv from "dotenv";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

import RenderHtmlPage from "./utils/renderHtml";

// Helper function to handle responses safely
function safeRespond(res: ServerResponse, callback: () => void) {
    if (res.headersSent) return; // Modern check to ensure headers aren't re-sent
    callback();
}

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const filePath = req.url === "/" ? "index.html" : req.url!.substring(1);
    const fullPath = path.join(__dirname, filePath);

    const mimeType: Record<string, string> = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".ts": "application/javascript", // load transpiled TypeScript as JavaScript
    };
    const ext = path.extname(filePath);
    const contentType = mimeType[ext] || "application/octet-stream";

    // Serve static files (CSS, JS, PNG, JPG), transpile TypeScript files on the fly, render index.html
    if ([".css", ".js", ".png", ".jpg"].includes(ext)) {
        fs.readFile(fullPath, (err, data) => {
            safeRespond(res, () => {
                if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    return res.end("404 Not Found");
                }
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
            });
        });
    } else if (ext === ".ts") {
        safeRespond(res, () => {
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
        });
    } else if (filePath === "index.html") {
        const html = new RenderHtmlPage("web-games");
        html.setDescription("Games made for fun");

        const appPath = `app/index.js`;
        html.addScript(appPath);

        // Inject hot-reload script if in development mode
        if (NODE_ENV === "development") {
            html.addScript("/hot-reload.js");
        }

        const htmlContent = html.renderLayout();

        safeRespond(res, () => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(htmlContent);
        });
    } else {
        safeRespond(res, () => {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
        });
    }
});

// WebSocket server for hot-reload
if (NODE_ENV === "development") {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        console.log("Hot-reload WebSocket connected");
    });

    // Use Chokidar for watching file changes
    const watcher = chokidar.watch(path.join(__dirname), {
        ignored: /node_modules|\.git/,
        persistent: true,
        ignoreInitial: true,
    });

    watcher.on("all", (event, filePath) => {
        console.log(`File ${event}: ${filePath}`);
        // Notify all connected clients to reload
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send("reload");
            }
        });
    });
}

// Serve hot-reload script
server.on("request", (req, res) => {
    if (req.url === "/hot-reload.js") {
        const hotReloadScript = `
            const ws = new WebSocket("ws://localhost:${PORT}");
            ws.onmessage = (message) => {
                if (message.data === "reload") {
                    console.log("Changes detected. Reloading...");
                    window.location.reload();
                }
            };
        `;
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(hotReloadScript);
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    if (NODE_ENV === "development") {
        console.log("Hot-reload enabled with Chokidar");
    }
});
