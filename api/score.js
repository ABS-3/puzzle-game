console.log("API FUNCTION LOADED");

const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const { name, moves, time } = req.body;

    // Basic validation
    if (!moves || !time) {
      return res.status(400).json({ message: "Invalid score data" });
    }

    const playerName = (name || "Anonymous").substring(0,20);

    const client = await clientPromise;
    const db = client.db("puzzleDB");
    const collection = db.collection("scores");

    await collection.insertOne({
      name: playerName,
      moves: Number(moves),
      time: Number(time),
      date: new Date()
    });

    res.status(200).json({ status: "saved" });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }

};