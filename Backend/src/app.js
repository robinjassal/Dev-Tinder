const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/User");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // const userObj = {
  //   firstName: "Akshay",
  //   lastName: "Saini",
  //   emailId: "akshay123@gmail.com",
  // };
  const userObj = req.body;
  //creating a new instance of the user model
  const user = new User(userObj);

  try {
    await user.save();
    res.send("user Added successfully");
  } catch (err) {
    res.status(400).send("error saving the user", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(5000, () => {
      console.log("Server is listening on Port 5000");
    });
  })

  .catch((err) => {
    console.error("Database cannot be connected");
  });
