const { default: mongoose }= require("mongoose")
const wishlistData = mongoose.Schema({
    userId:{
        type:String,
        required : true
    },
    products:{
        type:Array,
        required : true
    }

    
})
const wishlist = mongoose.model("wishlist",wishlistData).collection

module.exports=wishlist;