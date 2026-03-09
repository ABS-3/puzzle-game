const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let scoresCollection;

// Connect to MongoDB once
async function connectDB() {
  try {
    await client.connect();
    const db = client.db("puzzleDB");
    scoresCollection = db.collection("scores");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
}
connectDB();

// Define the /score route
app.post("/score", async (req, res) => {
  try {
    const score = req.body;
    await scoresCollection.insertOne(score);
    res.json({ status: "saved" });
  } catch (err) {
    console.error("Error inserting score:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Export the app for Vercel
module.exports = app;
