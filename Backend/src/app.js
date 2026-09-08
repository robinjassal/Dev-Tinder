const express = require("express");

const app = express();

// app.use("/", (req, res) => {
//   res.send("Home");
// });
app.use("/test/22", (req, res) => {
  res.send("test22");
});
app.use("/test", (req, res) => {
  res.send("test1");
});

app.use("/hello", (req, res) => {
  res.send("test helo");
});

app.listen(5000, () => {
  console.log("Server is listening on Port 5000");
});
