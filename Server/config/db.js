import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection succesfull✅");
  } catch (err) {
    console.error("MongoDb connection error‼️");
    process.exit(1);
  }
};

export default connectDB;