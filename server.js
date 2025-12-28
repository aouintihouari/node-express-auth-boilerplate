import "dotenv/config";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

await connectDB();

const server = app.listen(PORT, () =>
  console.log(`✅ Server is running on port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
