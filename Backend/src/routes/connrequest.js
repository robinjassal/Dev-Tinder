const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/User");

const connectionReqRouter = express.Router();

connectionReqRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "invalid status type: " + status,
        });
      }
      //we need to check is to user already existing
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "user not found",
        });
      }

      // if there is an existing connection request we need to restrict both other user and existing also should not able to send
      const existingConnectionReq = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionReq) {
        return res
          .status(400)
          .send({ message: "connection request already exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + status + " " + toUser.firstName,
        data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

module.exports = { connectionReqRouter };
