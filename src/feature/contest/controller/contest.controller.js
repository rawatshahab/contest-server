const {
  fetchLeetcodeContests,
  fetchCodeChefContests,
  fetchCodeForcesContests,
  syncDatabase,
} = require("../services/contest.service");
const Contestt = require("../models/contest.model");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../../utils/success.response");

module.exports.saveDB = async (req, res, next) => {
  try {
    await syncDatabase();
    sendSuccessResponse({
      res,
      statusCode: 200,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getAllContest = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    const { platform, contestType } = req.query;
    if (platform && platform !== "all") query.platform = platform;
    if (contestType) query.contestType = contestType;
    const contest = await Contestt.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ startTime: 1 });
    const total = await Contestt.countDocuments(query);

    sendSuccessResponse({
      res,
      statusCode: 200,
      data: {
        Contest: contest,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};
module.exports.verifyHandle = async (req, res, next) => {
  try {
    const { leetcodeHandle, codechefHandle, codeforcesHandle } = req.body;
    const okLeet = leetcodeHandle ? await verifyLeetCode(leetcode) : true;
    const okCF = codeforcesHandle ? await verifyCodeforces(codeforces) : true;
    const okCC = codechefHandle ? await verifyCodechef(codechef) : true;

    const invalids = [];
    if (!okLeet) invalids.push("LeetCode");
    if (!okCF) invalids.push("Codeforces");
    if (!okCC) invalids.push("CodeChef");
    if (!okLeet) {
      if (invalids.length) {
        // e.g. "Invalid LeetCode handle" or "Invalid LeetCode, CodeChef handles"
        return sendErrorResponse({
          res,
          statusCode: 400,
          message: `Invalid ${invalids.join(", ")} handle${
            invalids.length > 1 ? "s" : ""
          }`,
        });
      }
      req.session.userHandles = {
        ...(req.session.userHandles || {}),

        ...(okLeet && { leetcodeHandle }),
        ...(okCF && { codeforcesHandle }),
        ...(okCC && { codechefHandle }),
      };
      return sendSuccessResponse({
        res,
        statusCode: 200,
        data: { verified: true },
        message: "All Handle Verified",
      });
    }
  } catch (err) {
    next(err);
  }
};
