const express = require("express");

const app = express();

// app.use("/", (req, res) => {
//   res.send("Home");
// });

//this will only get request to /user
app.get("/user", (req, res) => {
  res.send("user1");
});

app.post("/user", (req, res) => {
  console.log("saving data");
  res.send("Data saved in db");
});

//this will match all the HTTP methods API calls to /test
app.use("/test/22", (req, res) => {
  res.send("test22");
});
app.use("/test", (req, res) => {
  res.send("test1");
});

app.use("/hello", (req, res) => {
  res.send("test helo");
});
app.get("/products/:abc", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.send({ firstName: "robin", lastname: "jassal" });
});

app.listen(5000, () => {
  console.log("Server is listening on Port 5000");
});
