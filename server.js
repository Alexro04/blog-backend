require("dotenv").config();
const express = require("express");
const connectToDB = require("./db/db");
const userRoutes = require("./routes/user-routes");

const app = express();

//connect to database
connectToDB();

//use middleware
app.use(express.json());

// routes;
app.use("/blog/user/", userRoutes);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is now listening on post ${PORT}`);
});
