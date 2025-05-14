import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB successfully");
        });
        mongoose.connection.on("error", (error) => {
            console.log("Error connecting to MongoDB in the future", error);
        });
        await mongoose.connect(config.databaseUrl as string);
       
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default connectDB;
