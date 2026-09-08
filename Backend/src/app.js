const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("helo from server");
});
app.use("/hello", (req, res) => {
  res.send("helo from server");
});

app.listen(5000, () => {
  console.log("Server is listening on Port 5000");
});
