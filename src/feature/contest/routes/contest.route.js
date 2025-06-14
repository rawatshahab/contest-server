const router = require('express').Router();

const {
    GET_ALL_CONTEST
} = require("../constants/routes");
const {
    getAllContestController
} = require("../controller/contestController");

router.get(GET_ALL_CONTEST,getAllContestController);

module.exports = router;