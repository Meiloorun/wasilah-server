const Message = require("../models/messageModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.sendDM = async (req, res, next) => {
    try {
        const {sender, recipient, message} = req.body;
        const data = await Message.create({
            message: message,
            recipient: recipient,
            sender: sender,
        });
        if (data) return res.json({ msg: 'Message Added' });
        return res.json({ msg: 'Failed to add Message '});
    } catch (error) {
        next(error);
    }
};

module.exports.sendGroup = async (req, res, next) => {
    try {
        const {sender, channel, message} = req.body;
        const data = await Message.create({
            message: message,
            channel: channel,
            sender: sender,
        });
        if (data) return res.json({ msg: 'Message Added' });
        return res.json({ msg: 'Failed to add Message '});
    } catch (error) {
        next(error);
    }
};

module.exports.getDmMessages = async (req, res, next) => {
    try {
        const { sender, recipient } = req.body;
        const messages = await Message.find({
            $or: [
                { sender, recipient },
                { sender: recipient, recipient: sender }
            ]
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => ({
            fromSelf: msg.sender.toString() === sender,
            message: msg.message,
            sender: msg.sender, 
            recipient: msg.recipient
        }));
        res.json(projectedMessages);
    } catch (error) {
        next(error);
    }
};

module.exports.getGroupMessages = async (req, res, next) => {
    try {
        const { channel } = req.body;
        const messages = await Message.find({
            channel: channel
        }).populate('sender', 'firstname secondname').sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => ({
            fromSelf: msg.sender._id.toString() === req.body.sender,
            message: msg.message,
            sender: msg.sender, 
            channel: msg.channel
        }));
        res.json(projectedMessages);
    } catch (error) {
        next(error);
    }
};
