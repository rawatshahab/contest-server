const mongoose = require("mongoose");

const leetSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  pastContests: [
    {
      problemSolved: Number,
      totalProblems: Number,
      rating: Number,
      title: String,
      startTime: Number,
      duration: String,
    },
  ],
  upcomingContests: [
    {
      title: String,
      startTime: Number,
      duration: Number,
    },
  ],
  userStats: {
    totalQuestionSolved: Number,
    platformRating: Number,
    totalContestGiven: Number,
  },
});
const codeforcesSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  pastContests: [
    {
      contestId: Number,
      contestType: String,
      problemSolved: Number,
      totalProblems: Number,
      rating: Number,
      title: String,
      startTimeInSeconds: Number,
      relativeTimeInSeconds: Number,
      duration: Number,
    },
  ],
  upcomingContests: [
    {
      title: String,
      contestType: String,
      startTimeInSeconds: Number,
      relativeTimeInSeconds: Number,
      duration: Number,
    },
  ],
  userStats: {
    totalQuestionSolved: Number,
    platformRating: Number,
    maxRating: Number,
    totalContestGiven: Number,
  },
});

const leetcodeDB = mongoose.model("leetcode", leetSchema);
const codeforcesDB = mongoose.model("codeforces", codeforcesSchema);
module.exports = { leetcodeDB, codeforcesDB };
