const mongoose = require("mongoose")

const user = mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
    }
})

module.exports = mongoose.model("passportUser",user)