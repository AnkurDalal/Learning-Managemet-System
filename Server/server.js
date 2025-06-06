import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./Controllers/webhooks.js";
import educatorRouter from "./Routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./Routes/courseRoute.js";
import userRouter from "./Routes/userRoutes.js";

const app = express();

async function startServer() {
  try {
    // Connect to DBs
    await connectDb();
    await connectCloudinary();

    // Global middleware
    app.use(cors());
    app.use(clerkMiddleware());
    app.use(express.json()); // parse JSON bodies globally

    // Routes
    app.get("/", (req, res) => {
      res.send("API working");
    });

    app.post("/clerk", express.json(), clerkWebhooks);
    app.use("/api/educator", express.json(), educatorRouter);
    app.use("/api/course", express.json(), courseRouter);
    app.use("/api/user", express.json(), userRouter);

    // Stripe webhook must parse raw body
    app.post(
      "/stripe",
      express.raw({ type: "application/json" }),
      stripeWebhooks
    );

    // Basic error handler middleware (optional)
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
