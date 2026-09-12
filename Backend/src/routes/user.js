const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/User");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

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
    res.status(400).send("Error: " + error.message);
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
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    // user should not see his own Card and which already connected, also ignore card and already sended requests
    const loggedInUser = req.user;

    //Find all connection requests (sent +received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    });
    //   .populate("fromUserId", "firstName")
    //   .populate("toUserId", "firstName");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
    // res.json({
    //   message: "Data fetched successfully",
    //   data: connectionRequests,
    // });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;
