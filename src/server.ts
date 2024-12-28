import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import { IncomingMessage, ServerResponse } from "http";
import RenderHtmlPage from "./utils/renderHtml";

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    let filePath = req.url === "/" ? "index" : req.url!.substring(1); // Remove leading "/"
    const fullPath = path.join(__dirname, filePath);

    // Determine MIME type
    const mimeType: Record<string, string> = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
    };
    const ext = path.extname(filePath);
    const contentType = mimeType[ext] || "application/octet-stream";

    if (ext === ".css" || ext === ".js" || ext === ".png" || ext === ".jpg") {
        // Serve static files as usual
        fs.readFile(fullPath, (err: any, data: any) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
            }
        });
    } else {
        // Serve dynamic HTML page
        const renderer = new RenderHtmlPage("My Dynamic Page");
        renderer.setDescription("This is a dynamically generated page.");
        const htmlContent = renderer.renderLayout();

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlContent);
    }
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
