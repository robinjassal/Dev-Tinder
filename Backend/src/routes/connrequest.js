const express = require("express");
const { userAuth } = require("../middleware/auth");

const connectionReqRouter = express.Router();

connectionReqRouter.post(
  "/sendConnectionRequest",
  userAuth,
  async (req, res) => {
    try {
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

module.exports = { connectionReqRouter };
