const router = require('express').Router();

const {
    GET_ALL_CONTEST,
    SAVE_TO_DB,
} = require("../constants/routes");
const {
    getAllContestController,
    saveToDbController
} = require("../controller/contestController");

router.get(GET_ALL_CONTEST,getAllContestController);
router.post(SAVE_TO_DB,saveToDbController);
module.exports = router;