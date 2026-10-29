import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database before accepting any requests
  await connectDB();

  // Start Express server only after DB is ready
  const server = app.listen(PORT, () => {
    console.log(`[Server] EduVault Backend running at http://localhost:${PORT}`);
  });

  // Handle process termination cleanly
  process.on("SIGINT", () => {
    server.close(() => {
      console.log("[Server] Closed gracefully");
      process.exit(0);
    });
  });
};

startServer();
