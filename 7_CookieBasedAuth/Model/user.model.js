const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id:{
        type: String,
        require: false
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('users', userSchema)