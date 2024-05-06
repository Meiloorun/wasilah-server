const { register, login, allcontacts } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/allcontacts/:id", allcontacts);

module.exports = router; 