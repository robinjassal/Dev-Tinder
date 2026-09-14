const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cors = require("cors");
const User = require("./models/User");

const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const { connectionReqRouter } = require("./routes/connrequest");
const userRouter = require("./routes/user");
const startCleanupJob = require("./utils/cronjob");
const paymentRouter = require("./routes/payment");
require("./utils/cronjob");

const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-tinder-1-s10n.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionReqRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDB()
  .then(() => {
    console.log("Database connection established");
    startCleanupJob();
    app.listen(5000, () => {
      console.log("Server is listening on Port 5000");
    });
  })

  .catch((err) => {
    console.error("Database cannot be connected");
  });
