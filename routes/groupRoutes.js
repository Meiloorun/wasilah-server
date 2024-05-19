const { getGroups, assignRole, getGroup, getUsersInGroup, getRolesInGroup } = require("../controllers/groupController");

const router = require("express").Router();

router.get("/getGroups/:_id", getGroups);
router.post('/assign-role', assignRole);
router.get('/:groupId', getGroup);
router.get('/:groupId/users', getUsersInGroup);
router.get('/:groupId/roles', getRolesInGroup);

module.exports = router;