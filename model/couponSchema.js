const { default: mongoose }= require("mongoose")
const couponData = mongoose.Schema({
    coupon:{
        type:String,
        required : true
    },
    date:{
        type:Date,
        required:true
    },
    item:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    discountType:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
   

    
})
const coupon = mongoose.model("coupon",couponData).collection

module.exports=coupon;