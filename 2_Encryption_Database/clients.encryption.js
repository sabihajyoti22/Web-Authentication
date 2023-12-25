const mongoose = require("mongoose")
const encrypt = require('mongoose-encryption');

const clientSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    }
})

var encKey = process.env.ENC_KEY;
clientSchema.plugin(encrypt, {
    secret: encKey,
    encryptedFields: ["password"]
})

module.exports = mongoose.model("clientDB",clientSchema)