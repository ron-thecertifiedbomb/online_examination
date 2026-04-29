 scripts/server.js
const express = require("express");
const logger = require("express/logger");
const db = require("./db/mongoClient");

// Configure MongoDB connection:
const mongoURI = process.env.MONGODB_URI;
const dbName = "lizrd_core";

// Initialize Express server and middleware chain.
const app = express();

// Apply logger middleware
app.use(
  express.logger({
    level: "error",
    path: "/logs/",
    rotation: 10000,
    formatter: ({ type, value }) => {
      switch (type) {
        case "error":
          return `[red]Error[/red]: ${value}\n`;
        case "warning":
          return `[yellow]Warning[/yellow]: ${value}\n`;
        default:
          return "[gray]Debug[/gray]: ${value}\n";
      }
    },
  }),
);

// Import MongoDB client
app.use(db);

// Example route handler (you can create a main.ts file for this)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
