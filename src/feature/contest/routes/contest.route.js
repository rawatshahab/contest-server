const router = require("express").Router();

const { GET_ALL_CONTEST,SAVE_DB } = require("../constants/routes");
const { getUserContestController,saveDB } = require("../controller/contest.controller");

router.get(GET_ALL_CONTEST, getUserContestController);
router.post(SAVE_DB,saveDB);
module.exports = router;
