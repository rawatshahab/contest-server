const {
  fetchLeetcodeContestsAndUserData,
  fetchCodeChefContests,
  fetchCodeForcesContestAndUserData,
} = require("../../../services/contest.services");
const {leetcodeDB} = require("../models/user.model");
const {codeforcesDB} = require("../models/user.model");
module.exports.syncDatabase = async (leetcodee, codeforcess) => {
  try {
    const leetcodeID = leetcodee;
    const codeforcesID = codeforcess;
    const [leetcode, codeforces, codechefs] = await Promise.all([
      fetchLeetcodeContestsAndUserData(leetcodeID),
      fetchCodeForcesContestAndUserData(codeforcesID, (page = 10)),
      fetchCodeChefContests(),
    ]);
    const totalQuestionSolvedLeetcode =
      leetcode.userProfile.data.matchedUser.submitStatsGlobal.acSubmissionNum[0]
        .count;
    const platformRatingLeetcode = leetcode.userContestRanking.rating;
    const totalContestGivenLeetcode =
      leetcode.userContestRanking.attendedContestsCount;
    const upcomingContestsLeetcode = (leetcode.upcoming || []).map(
      (contest) => ({
        title: contest.title || "",
        startTime: contest.startTime || 0,
        duration: contest.duration || 0,
      })
    );
    const pastContestsLeetcode = (leetcode.past || []).map((contest) => ({
      title: contest.title || "",
      startTime: contest.startTime || 0,
      duration: contest.duration || 0,
    }));
    //codeforces

    const upcomingContestsCodeforces = (codeforces.upcomingContests || []).map(
      (contest) => ({
        title: contest.name,
        contestType: contest.type,
        startTimeInSeconds: contest.startTimeSeconds,
        relativeTimeInSeconds: contest.relativeTimeSeconds,
        duration: contest.durationSeconds,
      })
    );
    const userStatscodeforces = {
      totalQuestionSolved: codeforces.totalSolved,
      platformRating: codeforces.userProfile.rating,
      maxRating: codeforces.userProfile.maxRating,
      totalContestGiven: codeforces.userProfile.contribution,
    };
    const pastContestcodeforces = (codeforces.pastContests || []).map(
      (contestss) => ({
        contestId: contestss.id,
        contestType: contestss.type,
        title: contestss.name,
        startTimeInSeconds: contestss.startTimeSeconds,
        relativeTimeInSeconds: contestss.relativeTimeSeconds,
        duration: contestss.durationSeconds,
      })
    );
    await Promise.all([
      leetcodeDB.findOneAndUpdate(
        { userId: leetcodee }, // Find by userId
        {
          $set: {
            upcomingContests: upcomingContestsLeetcode,   
            pastContests: pastContestsLeetcode,
            userStats: {
              totalQuestionSolved:totalQuestionSolvedLeetcode,
              platformRating:platformRatingLeetcode,
              totalContestGiven:totalContestGivenLeetcode,
            },
          },
        },
        { upsert: true, new: true }
      ),
      codeforcesDB.findOneAndUpdate(
        { userId: codeforcess }, // Find by userId
        {
          $set: {
            upcomingContests: upcomingContestsCodeforces,
            pastContests: pastContestcodeforces,
            userStats: userStatscodeforces,
          },
        },
        { upsert: true, new: true }
      ),
    ]);
  } catch (err) {
    console.log(err);
  }
};
