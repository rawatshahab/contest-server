const axios = require("axios");
module.exports.getLeetcodeContestService = async () => {
  try {
    const graphQuery = {
            query:`query getContestList{
                allContests {
                title
                    startTime
                     duration
                      titleSlug
                      endTime
                }}`
    };
    const response = await axios.post('https://leetcode.com/graphql',graphQuery,
        {headers:{'Content-Type':'applicaton/json'}},
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getCodeChefsContestService = async()=>{
    try{
        const response = await axios.post("https://www.codechef.com/api/list/contests/all");
        return response.data;
    }catch(err){
        console.log(err);
    }
}

module.exports.getCodeforcesContestService = async()=>{
    try{
        const response = await axios.post("https://codeforces.com/api/contest.list?gym=false");
        return response.data;
    }catch(err){
        console.log(err);
    }
}