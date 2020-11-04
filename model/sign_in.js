const mongoose = require("mongoose")


const userSchema = new mongoose.schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type: String,
         required: true
    }
})

module.exports = mongoose.module("sign_in",userSchema)
