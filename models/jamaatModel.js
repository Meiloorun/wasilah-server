const mongoose = require("mongoose");

const jamaatSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    region: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Region', 
        required: true,
    },
})

const Jamaat = mongoose.model('Jamaat', jamaatSchema);

module.exports = Jamaat;
