const axios = require("axios");
const Contestt = require("../models/contest.model");
function parseCodechefDate(str) {
  return Math.floor(new Date(str.replace(/\s+/, " ")).getTime() / 1000);
}

module.exports.fetchLeetcodeContests = async () => {
  try {
    const contestQuery = {
      query: `
        query {
          allContests {
            title
            titleSlug
            startTime
            duration
          }
        }
      `,
    };
    const response = await axios.post(
      "https://leetcode.com/graphql",
      contestQuery,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const allContests = response.data.data.allContests || [];
    const now = Date.now() / 1000;

    return {
      upcoming: allContests.filter((c) => c.startTime > now),
      past: allContests.filter((c) => c.startTime <= now),
    };
  } catch (err) {
    console.error("LeetCode Error:", err.message);
    return { error: true, message: err.message };
  }
};

module.exports.fetchCodeChefContests = async () => {
  try {
    const response = await axios.get(
      "https://www.codechef.com/api/list/contests/all"
    );
    return {
      future: response.data.future_contests,
      present: response.data.present_contests,
      past: response.data.past_contests,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports.fetchCodeForcesContests = async () => {
  try {
    const response = await axios.get(
      "https://codeforces.com/api/contest.list?gym=false"
    );

    const allContests = response.data.result;

    return {
      upcomingContests: allContests.filter((c) => c.phase === "BEFORE"),
      pastContests: allContests
        .filter((c) => c.phase === "FINISHED"),
    };
  } catch (err) {
    console.error("Codeforces Error:", err.message);
    return { error: true, message: err.message };
  }
};

module.exports.syncDatabase = async () => {
  try {
    const [leetcode, codechef, codeforces] = await Promise.all([
      module.exports.fetchLeetcodeContests(),
      module.exports.fetchCodeChefContests(),
      module.exports.fetchCodeForcesContests(),
    ]);

    // ---- Map all platforms ----
    const leetCodeContestUpcoming = (leetcode.upcoming || []).map(
      (contest) => ({
        platform: "leetcode",
        contestId: contest.titleSlug,
        contestName: contest.title,
        contestType: "upcoming",
        startTime: contest.startTime,
        duration: contest.duration,
      })
    );
    const leetCodeContestPast = (leetcode.past || []).map((contest) => ({
      platform: "leetcode",
      contestId: contest.titleSlug,
      contestName: contest.title,
      contestType: "past",
      startTime: contest.startTime,
      duration: contest.duration,
    }));

    const codeforcesUpcomingContests = (codeforces.upcomingContests || []).map(
      (contest) => ({
        platform: "codeforces",
        contestId: String(contest.id),
        contestName: contest.name,
        contestType: "upcoming",
        startTime: contest.startTimeSeconds,
        duration: contest.durationSeconds,
      })
    );
    const codeforcesPastContests = (codeforces.pastContests || []).map(
      (contest) => ({
        platform: "codeforces",
        contestId: String(contest.id),
        contestName: contest.name,
        contestType: "past",
        startTime: contest.startTimeSeconds,
        duration: contest.durationSeconds,
      })
    );

    const codechefUpcomingContests = (codechef.future || []).map((contest) => ({
      platform: "codechef",
      contestId: contest.contest_code,
      contestName: contest.contest_name,
      contestType: "upcoming",
      startTime: parseCodechefDate(contest.contest_start_date),
      duration: Number(contest.contest_duration) * 60,
    }));
    const codechefPastContests = (codechef.past || []).map((contest) => ({
      platform: "codechef",
      contestId: contest.contest_code,
      contestName: contest.contest_name,
      contestType: "past",
      startTime: parseCodechefDate(contest.contest_start_date),
      duration: Number(contest.contest_duration) * 60,
    }));

    // ---- Combine all contests into one array ----
    const allContests = [
      ...leetCodeContestUpcoming,
      ...leetCodeContestPast,
      ...codeforcesUpcomingContests,
      ...codeforcesPastContests,
      ...codechefUpcomingContests,
      ...codechefPastContests,
    ];

    // ---- Prepare bulk operations for upsert ----
    const bulkOps = allContests.map((contest) => ({
      updateOne: {
        filter: { platform: contest.platform, contestId: contest.contestId },
        update: { $set: contest },
        upsert: true,
      },
    }));

    if (bulkOps.length === 0) {
      console.log("No contests to save.");
      return;
    }
   const result =  await Contestt.bulkWrite(bulkOps);

  } catch (err) {
    console.log(err);
  }
};

module.exports.verifyLeetCode = async(username) =>{
  try{}
  catch(err){
    console.log(err);
  }
  const query = {
    query: `
      query matchedUser($username: String!) {
        matchedUser(username: $username) {
          username
        }
      }
    `,
    variables: { username }
  };
  try {
    const { data } = await axios.post(
      'https://leetcode.com/graphql',
      query,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return Boolean(data.data.matchedUser);
  } catch (err) {
    // network or GraphQL error
    return false;
  }
}
module.exports.verifyCodeforces= async(handle)=> {
  try {
    const res = await axios.get(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`
    );
    return res.data.status === 'OK' && res.data.result.length > 0;
  } catch (err) {
    // 400 or other error if handle doesn’t exist
    return false;
  }
};
module.exports.verifyCodechef = async(handle) => {
  try {
    // HEAD is a bit lighter than GET
    await axios.head(`https://www.codechef.com/users/${encodeURIComponent(handle)}`);
    return true;    // 200 OK
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return false; // not found
    }
    // other network errors, treat as “invalid” or retry
    return false;
  }
}