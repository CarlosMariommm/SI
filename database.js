import mongoose from "mongoose";
import { config } from "./config.js";

mongoose.connect(config.db.URI);

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("DB is connected");
}); 
connection.once("close", () => {
    console.log("DB is disconnected" + err);
}); 
connection.once("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
}); 