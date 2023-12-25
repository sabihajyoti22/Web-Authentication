const mongoose = require("mongoose")

const clientSchema = mongoose.Schema({
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    }
})

module.exports = mongoose.model("clientDB",clientSchema)