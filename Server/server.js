import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./configs/mongodb.js";
import { clerkWebhooks } from "./Controllers/webhooks.js";

//Initialize express
const app = express();

//connect to database
await connectDb();

//Middleware
app.use(cors());

//Routes
app.get("/", (req, res) => {
  res.send("Api working");
});

app.post('/clerk',express.json(),clerkWebhooks)

//Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
