import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, { dbName: "AuthenticationJWT" });
    console.log("🔗 Connection to the database established");
  } catch (err) {
    console.log("💥 Connection to the database couldn't be established", err);
  }
};

export default connectDB;
