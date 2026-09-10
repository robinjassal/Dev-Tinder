const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/User");
const bcrypt = require("bcrypt");
const { validationSignupData } = require("./utils/validation");

app.use(express.json());

app.post("/signup", async (req, res) => {
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

//Get user by email

app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: email });
    res.send(user);
    if (!user) {
      res.status(404).send("user not found");
    }
    //this is give all user even same email
    // const user = await User.find({ emailId: email });
    // if (user.length === 0) {
    //   res.status(404).send("user not found");
    // }
    // res.send(user);
  } catch (e) {
    res.status(400).send("something went wrong");
  }
});

//Feed API - GET /feed - get all the users from the database

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.status(404).send("user not found");
    }
    res.send(user);
  } catch (e) {
    res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // both are same it shorthand
    const user = await User.findByIdAndDelete(userId);
    // const user = await User.findByIdAndDelete({_id:userId})
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("user deleted successfully");
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

//update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

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
