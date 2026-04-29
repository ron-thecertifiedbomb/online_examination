import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import productsRoute from "./rest/routes/products.route.js";
import meRoute from "./rest/routes/me.route.js";
import blogRoute from "./rest/routes/blog.route.js";
import youtubeRoutes from "./rest/routes/youtubeRoutes.js";
import youtubeProgressRoutes from "./rest/routes/youtubeProgressRoute.js";
import examRoute from "./rest/routes/exam.route.js";
//Middleware
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const profile = express.static("public");

connectDB();

// Routes
app.use("/me", meRoute);
app.use("/api/products", productsRoute);
app.use("/", profile);
app.use("/api/blogs", blogRoute);
app.use("/api/exams", examRoute);
app.use("/api/youtube-to-mp3", youtubeProgressRoutes);
app.use("/api/youtube-to-mp3", youtubeRoutes);
app.use((req, res) => {
  res.status(404).send(`
        <h2>Uh Oh!</h2>
        <p>Sorry, ${req.url} cannot be found here</p>
    `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
