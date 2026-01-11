import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import ratelimit from "./config/upstash.js";

dotenv.config();

// Connect to DB


console.log("Mongo URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON
app.use(express.json());

// ✅ Custom middleware for rate limiting
app.use(async (req, res, next) => {
  try {
    const identifier = req.ip; // you can also use req.headers['x-forwarded-for'] for proxies
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    next(); // fallback - allow request if rate limiter fails
  }
});

// Debug middleware - logs every request
app.use((req, res, next) => {
  console.log("We just got a new request!!", req.method, req.url);
  next();
});

// API routes
app.use("/api/notes", notesRoutes);

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on PORT: ${PORT}`);
});

});
