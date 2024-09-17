const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    log: [{
        description: String,
        duration: Number,
        date: {type: String, required: false}
    }]
})

const User = mongoose.model("Users", userSchema)
module.exports = User