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

//Initialize express
const app = express();

//connect to database
await connectDb();
await connectCloudinary();

//Middleware
app.use(cors());
app.use(clerkMiddleware());

//Routes
app.get("/", (req, res) => {
  res.send("Api working");
});

app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post("/stripe",express.raw({type: 'application/json'}), stripeWebhooks);

//Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
