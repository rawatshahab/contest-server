const mongoose = require("mongoose");
const contestSchema = mongoose.Schema({
  platform: {
    type: String,
    required: true,
  },
  contestId: {
    type: String,
    required: true,
  },
  contestName: {
    type: String,
    required: true,
  },
  contestType: {
    type: String,
    default: null,
  },
  startTime: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

const Contest = mongoose.model("Contest", contestSchema);
module.exports = Contest;
