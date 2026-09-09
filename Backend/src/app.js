const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("handling the route user!!");
    next();
    // res.send("Response!!");
  },
  (req, res, next) => {
    console.log("handling the route user 2!!");
    next();
    // res.send("2nd response");
  },
  (req, res, next) => {
    console.log("handling the route user 3!!");
    next();
    // res.send("3rd response");
  },
);

// app.use("/route",rH,[rH1,rh2,rH2],rH3) perfectly valid

app.listen(5000, () => {
  console.log("Server is listening on Port 5000");
});
