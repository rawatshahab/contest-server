const {
  fetchLeetcodeContests,
  fetchCodeChefContests,
  fetchCodeForcesContests,
  syncDatabase,
} = require("../services/contest.service");
const Contestt = require("../models/contest.model");
const { sendSuccessResponse } = require("../../../utils/success.response");
module.exports.getUserContestController = async (req, res, next) => {
  try {
    const [leetcode, codechefs, codeforces] = await Promise.allSettled([
      fetchLeetcodeContests(),
      fetchCodeChefContests(),
      fetchCodeForcesContests(),
    ]);
    sendSuccessResponse({
      res,
      statusCode: 200,
      data: {
        dashboard: {
          leetcode,
          codeforces,
          codechefs,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
module.exports.saveDB = async (req,res,next) =>{
  try{
    await syncDatabase();    
    sendSuccessResponse({
      res,
      statusCode:200,
      data:null,
    })
  }catch(err){
    next(err);
  }
}
