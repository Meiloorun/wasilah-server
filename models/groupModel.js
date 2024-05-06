const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 1,
        required: true,
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false,
    },
    channels: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Channel',
        required: true,
    },
    jamaat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jamaat',
        required: false,
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: false,
    },
    roles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Role',
        required: true,
    },

});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;