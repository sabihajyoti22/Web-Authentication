const mongoose = require("mongoose")

const user = mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true,
    },
    gooogleId:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    }
})

module.exports = mongoose.model("googleAuth",user)