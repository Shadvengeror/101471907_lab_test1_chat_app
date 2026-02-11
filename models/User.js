const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,   // VERY IMPORTANT for marks
        trim: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createon: {
        type: String,
        default: () => {
            return new Date().toLocaleString();
        }
    }
});

module.exports = mongoose.model("User", userSchema);
