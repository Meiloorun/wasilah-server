const Group = require("../models/groupModel");
const Channel = require("../models/channelModel");
const Role = require("../models/roleModel");
const User = require('../models/userModel');

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

module.exports.getGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

module.exports.getUsersInGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('members');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const users = group.members;

    if (!users.length) {
      return res.status(404).json({ message: 'No users found in this group' });
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports.getRolesInGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const roles = await Role.find({ group: groupId });
    if (!roles.length) {
      return res.status(404).json({ message: 'No roles found in this group' });
    }
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

module.exports.assignRole = async (req, res, next) => {
  try {
    const { userId, roleId } = req.body;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.roles.push(role._id);
    await user.save();

    res.status(200).json({ message: 'Role assigned successfully', user });
  } catch (error) {
    next(error);
  }
};