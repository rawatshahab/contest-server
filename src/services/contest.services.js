const axios = require("axios");
module.exports.fetchLeetcodeContestsAndUserData = async (username) => {
  try {
   const userHistoryQuery = username ? {
      query: `
        query userContestRankingInfo($username: String!) {
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
    badge {
      name
    }
  }
  userContestRankingHistory(username: $username) {
    attended
    trendDirection
    problemsSolved
    totalProblems
    finishTimeInSeconds
    rating
    ranking
    contest {
      title
      startTime
    }
  }
    
}
      `,
      variables: {username}
    } : null;

        const userProfile = username ? {
      query: `
        query userProblemsSolved($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    problemsSolvedBeatsStats {
      difficulty
      percentage
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}
      `,
      variables: {username}
    } : null;

    // Two separate promises
    const contestPromise = axios.post("https://leetcode.com/graphql", contestQuery, {
      headers: { "Content-Type": "application/json" }
    });

    const userPromise = userHistoryQuery
      ? axios.post("https://leetcode.com/graphql", userHistoryQuery, {
          headers: { "Content-Type": "application/json" }
        })
      : Promise.resolve({ data: { data: { userContestRankingHistory: [] } } });
        const userprofile = userProfile
      ? axios.post("https://leetcode.com/graphql", userProfile, {
          headers: { "Content-Type": "application/json" }
        })
      : Promise.resolve({ data: { data: { userContestRankingHistory: [] } } });
    const [contestRes, userRes, profile] = await Promise.all([contestPromise, userPromise, userprofile]);

    const allContests = contestRes.data.data.allContests || [];
    const now = Date.now() / 1000;

    return {
      upcoming: allContests.filter(c => c.startTime > now),
      past: allContests.filter(c => c.startTime <= now).slice(0, 10),
      userContestRanking: userRes.data.data.userContestRanking|| [],
      userContestHistory:userRes.data.data.userContestRankingHistory.filter(contest=>contest.attended == true) || [],
      userProfile: profile.data || [],
    };
  } catch (err) {
    console.error("LeetCode Error:", err.message);
    return { error: true, message: err.message };
  }
};




module.exports.fetchCodeChefContests = async () => {
  try{
    const response = await axios.get("https://www.codechef.com/api/list/contests/all");
  return {
    future: response.data.future_contests,
    present: response.data.present_contests,
    past: response.data.past_contests,
  };
  }
  catch(err){
    console.log(err);
  }
  
}


module.exports.fetchCodeForcesContestAndUserData = async (username, page = 10) => {
  try {
    const contestPromise = axios.get("https://codeforces.com/api/contest.list?gym=false");

    // user.info and user.rating are both GET requests
    const profilePromise = username
      ? axios.get(`https://codeforces.com/api/user.info?handles=${username}`)
      : Promise.resolve({ data: { result: [] } });

    const ratingPromise = username
      ? axios.get(`https://codeforces.com/api/user.rating?handle=${username}`)
      : Promise.resolve({ data: { result: [] } });
    const questionSolved = username
    ? axios.get(`https://codeforces.com/api/user.status?handle=${username}`)
      : Promise.resolve({data:{result: []}});
    const [contestRes, profileRes, ratingRes, questionRes] = await Promise.all([
      contestPromise,
      profilePromise,
      ratingPromise,
      questionSolved,
    ]);

    const allContests = contestRes.data.result;
    const submissions = questionRes.data.result;
    const solvedSet = new Set();


  submissions.forEach(sub => {
    if (sub.verdict === "OK" && sub.problem) {
      // total
      solvedSet.add(sub.problem.contestId + "_" + sub.problem.index);
      // contest-specific
      // if (contestId && sub.problem.contestId === contestId) {
      //   contestSolvedSet.add(sub.problem.index);
      // }
    }
  });
    return {
      upcomingContests: allContests.filter(c => c.phase === "BEFORE"),
      pastContests: allContests.filter(c => c.phase === "FINISHED").slice(0, page),
      userProfile: profileRes.data.result[0] || null,
      userRating: ratingRes.data.result || [],
      totalSolved: solvedSet.size,

    };
  } catch (err) {
    console.error("Codeforces Error:", err.message);
    return { error: true, message: err.message };
  }
};