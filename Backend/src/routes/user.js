const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequests");
const userRouter = express.Router();

//Get all the pending connection request for the loggedIn user

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    req.statusCode(400).send("Error: " + error.message);
  }
});

// coreLogic: akshay =>sakshi => accepted sakshi=>robin =>accepted both to and from that are aceppted
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          status: "accepted",
          toUserId: loggedInUser._id,
        },
        {
          status: "accepted",
          fromUserId: loggedInUser._id,
        },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }

      return row.fromUserId;
    });
    res.json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    req.statusCode(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;
