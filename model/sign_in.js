const mongoose = require("mongoose")
const app  = express()

const userSchema = moongoose.schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique: true,
        required: true
    },
    password:{
type: String,
required:true
    }
})

module.exports = moongoose.module.userSchema()
