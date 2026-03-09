const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config(); // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());

// Use the URI from .env (make sure it's set in Vercel as MONGO_URI)
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let scoresCollection;

async function start() {
  try {
    await client.connect();
    const db = client.db("puzzleDB");
    scoresCollection = db.collection("scores");

    // Vercel provides PORT automatically, fallback to 3000 for local dev
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

start();

// Route to save scores
app.post("/score", async (req, res) => {
  try {
    const score = req.body;
    await scoresCollection.insertOne(score);
    res.send({ status: "saved" });
  } catch (err) {
    console.error("Error inserting score:", err.message);
    res.status(500).send({ status: "error", message: err.message });
  }
});
