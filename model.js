const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    images: {
        type: [String]
    }
}, {
    timestamps: true
})


const User = mongoose.model("user", userSchema)
const Item = mongoose.model("item", itemSchema);

module.exports = {User, Item}