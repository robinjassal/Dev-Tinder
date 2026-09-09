const express = require("express");

const app = express();

// GET /users ==> it check all the app.xxx("matching route") functions

// Get /users =>middleware chain =>request handle(which sends response that is called response handler)

app.use("/", (req, res) => {
  res.send("handling / route");
});

app.get(
  "/user",
  (req, res, next) => {
    console.log("handling the route user!!");
    next();
  },
  (req, res) => {
    console.log("handling the route user!!");
    res.send("2nd Route handler");
  },
);

app.listen(5000, () => {
  console.log("Server is listening on Port 5000");
});
