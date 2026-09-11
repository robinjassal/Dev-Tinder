const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/User");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("User not found");
    }
    res.send(req.user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

//update data of the user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const user = req.user;

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      runValidators: true,
      new: true,
    });

    res.send({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = profileRouter;
