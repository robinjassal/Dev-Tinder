const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);
ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
ConnectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  //   check if the from and to are same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send connection to yourself");
  }
});
const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema,
);

module.exports = ConnectionRequest;
