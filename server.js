require("dotenv").config();
const express = require("express");
const connectToDB = require("./db/db");
const authRoutes = require("./routes/auth-routes");
const postRoutes = require("./routes/posts-routes");

const app = express();

//connect to database
connectToDB();

//use middleware
app.use(express.json());

// routes;
app.use("/blog/auth", authRoutes);
app.use("/blog/posts", postRoutes);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is now listening on post ${PORT}`);
});
