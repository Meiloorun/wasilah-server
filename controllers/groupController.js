const Group = require("../models/groupModel");
const Channel = require("../models/channelModel");
const Role = require("../models/roleModel");

module.exports.getGroups = async (req, res, next) => {
  try {
    const userId = req.params._id;

    const groups = await Group.find({ members: userId }).populate([
      "jamaat",
      "region",
      "channels",
      "roles",
    ]);

    if (groups.length === 0) {
      return res.status(404).json({ message: "User does not belong to any group" });
    }

    return res.status(200).json({ groups });
  } catch (error) {
    next(error);
  }
};