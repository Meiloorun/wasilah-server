const {sendDM, sendGroup, getDmMessages, getGroupMessages} = require("../controllers/messagesController");

const router = require("express").Router();

router.post("/senddm", sendDM);
router.post("/sendgrp", sendGroup);
router.post("/getdm", getDmMessages);
router.post("/getgrp", getGroupMessages);

module.exports = router;