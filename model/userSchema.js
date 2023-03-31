var db = require('../config/connection')
const { default: mongoose }= require("mongoose")


const UserData=mongoose.Schema({
    name:{
        type:String,
        required : true
    },
    email:{
        type:String,
        required : true
    },
    phone:{
        type:Number,
        required : true
    },
    password:{
        type:String,
        required : true
    },
    status:{
        type:Boolean,
        required : true
    },
    wallet:{
        type:Number,
        required:true
    }
})

const user = mongoose.model("User",UserData).collection

module.exports=user;