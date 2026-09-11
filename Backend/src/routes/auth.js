const express = require("express");
const bcrypt = require("bcrypt");
const { validationSignupData } = require("../utils/validation");
const validator = require("validator");
const User = require("../models/User");

// internally app.use and router.use are same

// app = express();
// router = express.Router();
// app.use("/test", authMiddleware, () => {});
// router.use("/test", authMiddleware, () => {});

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // const userObj = {
  //   firstName: "Akshay",
  //   lastName: "Saini",
  //   emailId: "akshay123@gmail.com",
  // };
  try {
    // validation of data is required
    validationSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const userObj = req.body;
    //creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("user Added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      return res.status(400).send("Invalid email");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create a JWT Token
      const token = await user.getJWT();

      //Add the token and send the response back to the user
      res.cookie("token", token);

      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successful");
  } catch (error) {
    console.log(error);
  }
});

module.exports = authRouter;
