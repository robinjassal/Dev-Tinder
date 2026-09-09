const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");

const app = express();

//Middleware: handle auth middleware for all request
app.use("/admin", adminAuth);
app.use("/user", userAuth, (req, res) => {
  res.send("User Authenticated");
});

app.get("/admin/getAllData", (req, res, next) => {
  /*Check if the request is authourised
  const token = "xayz";
  const isAuthorized = token === "xyz";
  //Logic of fetching all data
  if (isAuthorized) {
    res.send("All Data Sent");
  } else {
    res.status(401).send("unautthorized request");
  }
*/
  res.send("All Data Sent");
});

app.get("/admin/deleteUser", (req, res, next) => {
  /*Check if the request is authourised
  const token = "xayz";
  const isAuthorized = token === "xyz";
  //Logic of fetching all data
  if (isAuthorized) {
    res.send("All Data Sent");
  } else {
    res.status(401).send("unautthorized request");
  }
  */
  //Logic of fetching all data
  res.send("All Data Deleted");
});

app.listen(5000, () => {
  console.log("Server is listening on Port 5000");
});
