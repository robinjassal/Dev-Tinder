const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/User");

const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const { connectionReqRouter } = require("./routes/connrequest");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionReqRouter);

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
