import mongoose from "mongoose";

//connect to mongodb database
const connectDb = async () => {
  mongoose.connection.on("connected", () => console.log("Database connected"));
  await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
};
export default connectDb
