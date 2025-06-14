const axios = require("axios");
module.exports.fetchLeetcodeContestsAndUserData = async (username) => {
  try {
    const upcomingPastQuery = {
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

    const userHistoryQuery = username
      ? {
          query: `
          query getUserContestRankingHistory($username: String!) {
            userContestRankingHistory(username: $username) {
              attended
              rating
              ranking
              totalParticipants
              finishTimeInSeconds
              contest {
                title
                startTime
                titleSlug
              }
            }
          }
        `,
          variables: { username },
        }
      : null;

    const [contestData, userData] = await Promise.all([
      axios.post("https://leetcode.com/graphql", upcomingPastQuery, {
        headers: { "Content-Type": "application/json" },
      }),
      userHistoryQuery
        ? axios.post("https://leetcode.com/graphql", userHistoryQuery, {
            headers: { "Content-Type": "application/json" },
          })
        : Promise.resolve({ data: null }),
    ]);

    return {
      upcoming: contestData.data.data.allContests.filter(
        (c) => c.startTime > Date.now() / 1000
      ),
      past: contestData.data.data.allContests
        .filter((c) => c.startTime <= Date.now() / 1000)
        .slice(0, 10),
      userHistory: userData.data?.data?.userContestRankingHistory || [],
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports.fetchCodeChefsContestAndUserData = async (username,page) => {
try {
    const [contestData, profile, ratingHistory] = await Promise.all([
      axios.get("https://codeforces.com/api/contest.list"),
      username
        ? (axios.get(
            `https://codeforces.com/api/user.info?handles=${username}`
          ),
          axios.get(
            `https://codeforces.com/api/user.rating?handle=${username}`
          ))
        : Promise.resolve({ data: null }),
    ]);
    return {
        pastContest: contestData.data.result.filter(contest=>contest.phase=="FINISHED").slice(0,page),
        upcomingContest: contestData.data.result.filter(contest=>contest.phase=="BEFORE"),
        userProfile:profile,
        userRating:ratingHistory,
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.fetchCodeForcesContestAndUserData = async (username,page) => {
try {
    const [contestData, profile, ratingHistory] = await Promise.all([
      axios.get("https://codeforces.com/api/contest.list"),
      username
        ? (axios.get(
            `https://codeforces.com/api/user.info?handles=${username}`
          ),
          axios.get(
            `https://codeforces.com/api/user.rating?handle=${username}`
          ))
        : Promise.resolve({ data: null }),
    ]);
    return {
        pastContest: contestData.data.result.filter(contest=>contest.phase=="FINISHED").slice(0,page),
        upcomingContest: contestData.data.result.filter(contest=>contest.phase=="BEFORE"),
        userProfile:profile,
        userRating:ratingHistory,
    }
  } catch (err) {
    console.log(err);
  }
};
