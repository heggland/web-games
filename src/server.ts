import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import { IncomingMessage, ServerResponse } from "http";
import * as dotenv from "dotenv";


dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

export const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {

  // the fun rework starts here

});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} (${NODE_ENV} mode)`);
});
