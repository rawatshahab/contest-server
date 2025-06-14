const mongoose = require("mongoose");

const leetSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  pastContests: [
    {
      problemSolved: Number,
      totalProblems: Number,
      rating: Number,
      name: String,
      date: Date,
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
  pastContests: {
    problemSolved: Number,
    totalProblems: Number,
    rating: Number,
    name: String,
    date: Date,
    duration: String,
  },
  upcomingContest: {
    title: String,
    startTime: Number,
    duration: Number,
  },
  userStats: {
    totalQuestionSolved: Number,
    platformRating: Number,
    maxRating: Number,
    totalContestGiven: Number,
  },
});

const leetcodeDB = mongoose.model("leetcode", leetSchema);
module.exports = leetcodeDB;
