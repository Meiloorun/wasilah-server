const { getGroups } = require("../controllers/groupController");

const router = require("express").Router();

router.get("/getGroups/:_id", getGroups);

module.exports = router;