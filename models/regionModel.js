const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
    name: {
        type: String,
    },
});

const Region = mongoose.model('Region', regionSchema);

module.exports = Region;