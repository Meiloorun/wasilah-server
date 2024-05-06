const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 1,
        required: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
})

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;