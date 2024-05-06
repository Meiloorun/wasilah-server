const mongoose = require("mongoose");

const preKeySchema = new mongoose.Schema({
    keyId: Number,
    publicKey: String,
    signature: String,
})

const registrationSchema = new mongoose.Schema({
    registrationId: Number,
    identityPubKey: String,
    publicSignedPreKey: preKeySchema,
    oneTimePreKey: [preKeySchema],
})

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        min: 1,
        max: 40,
        required: true,
    },
    secondname: {
        type: String,
        min: 1,
        max: 40,
        required: true,
    },
    email: {
        type: String,
        min: 5,
        required: true,
    },
    aimsid: {
        type: Number,
        min: 5,
        required: true,
    },
    phonenumber: {
        type: Number,
        min:3,
        required: false,
    },
    password: {
        type: String,
        min: 1,
        required: true,
    },
    dateofbirth: {
        type: Date,
        required: true,
    },
    jamaat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jamaat',
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    registration: registrationSchema,
    roles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Role',
        required: false,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;