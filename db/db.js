const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to database successfully.");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
}

module.exports = connectToDB;
