const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

module.exports = async function handler(req, res) {

  try {
    const client = await clientPromise;
    const db = client.db("puzzleDB");
    const collection = db.collection("scores");

    const leaderboard = await collection
      .find({})
      .sort({ time: 1 })
      .limit(10)
      .toArray();

    res.status(200).json(leaderboard);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};