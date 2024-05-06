const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 1,
        required: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    roles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Role',
        required: false,
    }
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;