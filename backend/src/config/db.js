import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notes_db";
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notes_db"}: ${error.message}`);
    console.info("[Database Info] Ensure MongoDB service is running locally or specify your MongoDB Atlas URI in backend/.env");
    return null;
  }
};

export default connectDB;
