const express = require("express");

const app = express();

app.use("/getUserData", (req, res) => {
  throw new Error("User not found");
  res.send("User Data Sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

app.listen(5000, () => {
  console.log("Server is listening on Port 5000");
});
