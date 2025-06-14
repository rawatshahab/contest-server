const {
  fetchLeetcodeContestsAndUserData,
  fetchCodeChefContests,
  fetchCodeForcesContestAndUserData,
} = require("../../../services/contest.services");
const leetcodeDB = require("../models/contests.model");
module.exports.syncDatabase = async (id) => {
  try {
    const username = id;
    const [leetcode, codeforces, codechefs] = await Promise.all([
      fetchLeetcodeContestsAndUserData(username),
      fetchCodeChefContests(),
      fetchCodeForcesContestAndUserData(username, (page = 10)),
    ]);
    const totalQuestionSolved =
      leetcode.userProfile.data.matchedUser.submitStatsGlobal.acSubmissionNum[0]
        .count;
    const platformRating = leetcode.userContestRanking.rating;
    const totalContestGiven = leetcode.userContestRanking.attendedContestsCount;
    const upcomingContests = (leetcode.upcoming || []).map((contest) => ({
      title: contest.title || "",
      startTime: contest.startTime || 0,
      duration: contest.duration || 0,
    }));
    const pastContests = (leetcode.past || []).map((contest)=>({
      title: contest.title || "",
      startTime: contest.startTime || 0,
      duration: contest.duration || 0,
    }));
    await leetcodeDB.findOneAndUpdate(
      { userId: username }, // Find by userId
      {
        $set: {
          upcomingContests:upcomingContests,
          pastContests:pastContests,
          userStats: {
            totalQuestionSolved,
            platformRating,
            totalContestGiven,
          },
        },
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.log(err);
  }
};
