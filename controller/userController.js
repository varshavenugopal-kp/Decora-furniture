const userCollection = require('../model/userSchema')
var bcrypt=require('bcrypt')
const { set, response } = require('../app');
const cart =  require('../model/cartSchema')
const products=require('../model/productScema')
const orders=require('../model/orderschema')
const mongoose=require('mongoose');
const {ObjectId} = mongoose.Types;
const uuid = require('uuid');
const { logger } = require('../model/userSchema');
const wishlist=require('../model/wishlistSchema')
const nodemailer=require('nodemailer');
const category = require('../model/categorySchema');
const { productList } = require('./adminController');
require('dotenv').config()


function getCount(userId) {
  return new Promise(async (resolve, reject) => {
    var count;
    let carts = await cart.findOne({ user: ObjectId(userId) })

    if (carts) {

      count = carts.products.length
    
    }
    if (!cart) {
      count = 0
    }
    resolve(count)

  })
}

function wishlistCount(userId) {
  return new Promise(async (resolve, reject) => {
    var count;
    let wishlists = await wishlist.findOne({ user: ObjectId(userId) })

    if (wishlists) {

      count = wishlists.products.length
    
    }
    if (!wishlists) {
      count = 0
    }
    resolve(count)

  })
}




module.exports={

  getOtpLogin: async (req, res, next) => {
    try {
      var user = req.session.user
      if (user) {
        res.redirect('/')
      } else {
        otp = req.session.otp
        data = req.session.otpData
        err = req.session.otpErr
        invalid = req.session.InvalidOtp
        res.render('users/otplogin', { otp, data, err, invalid })
        req.session.otpErr = null
        req.session.InvalidOtp = null
      }
    }
    catch (err) {
      next(err)
    }
  },


// home get products

  getProducts: async (req, res, next) => {
    try {
      let loggedIn=req.session.loggedIn
      console.log("huhughggu");
      let user = req.session.user
      let cartCount = null
      if (req.session.user) {
        cartCount = await getCount(req.session.user._id)
      }
       console.log("gdtfgf",cartCount);
      let data = await products.find().toArray();

      console.log("hjbjgj", data);
      res.render('users/home', { data, user, cartCount ,loggedIn});
    }
    catch (err) {
      next(err)
    }

  },


  // otp verification

  otpVerification : async(req,res,next)=>{
    try{
      let data = req.body;
    let response={}
        let checkuser = await userCollection.findOne({email:data.email})
        console.log(data,checkuser);
        if(checkuser){
          if(checkuser.status) {
            otpEmail = checkuser.email
            response.otp = OTP()
            let otp = response.otp
            let mailTransporter = nodemailer.createTransport({
                service : "gmail",
                auth : {
                    user:'decorafurniture61@gmail.com',
                    pass:process.env.EMAIL_PASSWORD
                }
            })
            
            let details = {
                from:'decorafurniture61@gmail.com',
                to:'varshavenugopal642@gmail.com', 
                subject:"Decora",
                text: otp+" is your Decora verification code. Do not share OTP with anyone "
            }
  
            mailTransporter.sendMail(details,(err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("OTP Send Successfully ");
                }
            })
  
            function OTP(){
                OTP = Math.random()*1000000
                OTP = Math.floor(OTP)
                return OTP
            }
            response.user = checkuser
            response.status = true
            if(response.status){
              req.session.otp=response.otp;
              req.session.otpData=req.body;
              req.session.otpUser=response.user;
              res.redirect('/otp-login')
            }
            
            // resolve(response) 
          }
          else{
            req.session.otpErr="Entered email is blocked!";
            res.redirect('/otp-login');
            req.session.otpErr = null;
          }
        }
        else{
          req.session.otpErr="Email not registered!";
          res.redirect('/otp-login');
          req.session.otpErr = null; 
        }
    }
    catch(err){
      next(err)
     }
    },



   otpLogin : async(req,res,next)=>{
    try{
      console.log(req.body);
    otp=req.session.otp
    userOtp=req.body.password
    var user=req.session.otpUser
    if(otp==userOtp){
      req.session.user=user
      req.session.otp=null
      console.log("success");
      res.redirect('/')   
    }else{
      req.session.InvalidOtp="Invalid Otp"
      console.log("err");
      res.redirect('/otp-login')
    }
    }
    catch(err){
      next(err)
     }
   },



   otpPaswd:(req,res,next)=>{
    try{
      otp=req.session.otp
    data=req.session.otpData
    err=req.session.otpErr
    invalid=req.session.InvalidOtp
      res.render('users/reset-password',{otp,err,data,invalid});
      req.session.otpErr=null
      req.session.InvalidOtp = null 
    }
    catch(err){
      next(err)
     }
   },




   verifyOtp: async(req,res,next)=>{
    try{
       let data = req.body;
    let response={}
        let checkuser = await userCollection.findOne({email:data.email})
        console.log(data,checkuser);
        if(checkuser){
          if(checkuser.status) {
            otpEmail = checkuser.email
            response.otp = OTP()
            let otp = response.otp
            let mailTransporter = nodemailer.createTransport({
                service : "gmail",
                auth : {
                    user:'decorafurniture61@gmail.com',
                    pass:process.env.EMAIL_PASSWORD
                }
            })
            
            let details = {
                from:'decorafurniture61@gmail.com',
                to:'varshavenugopal642@gmail.com', 
                subject:"Decora",
                text: otp+" is your Decora verification code. Do not share OTP with anyone "
            }
  
            mailTransporter.sendMail(details,(err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("OTP Send Successfully ");
                }
            })
  
            function OTP(){
                OTP = Math.random()*1000000
                OTP = Math.floor(OTP)
                return OTP
            }
            response.user = checkuser
            response.status = true
            if(response.status){
              req.session.otp=response.otp;
              req.session.otpData=req.body;
              req.session.email=data.email
              console.log("emailll",req.session.email);
              req.session.otpUser=response.user;
              res.redirect('/password-otp')
            }
            
            // resolve(response) 
          }
          else{
            req.session.otpErr="Entered email is blocked!";
            res.redirect('/password-otp');
            req.session.otpErr = null;
          }
        }
        else{
          req.session.otpErr="Email not registered!";
          res.redirect('/password-otp');
          req.session.otpErr = null; 
        }
  
    }
    catch(err){
      next(err)
     }
   },



  pswdOtp:(req,res,next)=>{
    try{
      console.log(req.body);
    otp=req.session.otp
    userOtp=req.body.password
    var user=req.session.otpUser
    console.log("otp",otp);
    console.log("userotp",userOtp);
    if(otp==userOtp){
      req.session.user=user
      req.session.otp=null
      console.log("success");
      res.redirect('/reset-password')   
    }else{
      req.session.InvalidOtp="Invalid Otp"
      console.log("err");
      res.redirect('/password-otp')
    }
    }
    catch(err){
      next(err)
     }
  },



  resetpswd:(req,res,next)=>{
    try{
        res.render('users/password-reset')
    }
    // var err= req.session.erMsg
    //   let userId=req.params.id
   
      // req.session.erMsg=null
      catch(err){
        next(err)
       }
  },

  pswdreset:async(req,res,next)=>{
    try{
       var response = {};
    email=req.session.email
    let userId = req.params.id;
    let data = req.body;
       
          console.log("pswd",data.npassword);
          console.log("pswd",data.cpassword);
        if(data.npassword==data.cpassword){
            data.npassword = await bcrypt.hash(data.npassword,10);
            console.log("data.npassword = ",data.npassword);
            userCollection.updateOne({email:email},{$set:{password:data.npassword}});
            res.redirect('/user-login')
           
        }
    }
   
    catch(err){
      next(err)
     }  
  
    
  },
   










    userSignup:(req,res,next)=>{
      try{
          var err=req.session.rmsg
        res.render('users/user-signup',{err})
        req.session.msg=null
      }
      catch(err){
        next(err)
       }
    },

    insertUser:async(req,res,next)=>{
      try{
        let userInfo=req.body
        var rmsg
        var nameRegex = /^([A-Za-z ]){5,25}$/gm;
        var pswdregx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]){8,16}/gm
        var emailregx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        var phoneregx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        const validatemail = await userCollection.findOne({ email: userInfo.email })
        if (userInfo.name == '') {
          req.session.rmsg = "Name field is empty"
          res.redirect('/user-signup')
        } else if(nameRegex.test(userInfo.name)!=true){
        req.session.rmsg ="Enter valid name"
           res.redirect('/user-signup')
        }else if (userInfo.email == '') {
        req.session.rmsg = "Email field is empty"
          res.redirect('/user-signup')
        } else if (validatemail) {
        req.session.rmsg = "Email already exist"
          res.redirect('/user-signup')
        } else if (emailregx.test(userInfo.email) != true) {
        req.session.rmsg = "Invalid email"
          res.redirect('/user-signup')
        } else if (userInfo.phone == '') {
        req.session.rmsg = "Phone number field is empty"
          res.redirect('/user-signup')
        } else if (phoneregx.test(userInfo.phone) != true) {
        req.session.rmsg = "Invalid Phone number"
          res.redirect('/user-signup')
        } else if (userInfo.password == '') {
        req.session.rmsg = "Password field is empty" 
          res.redirect('/user-signup')
        } else if (pswdregx.test(userInfo.password) != true) {
        req.session.rmsg = "password should contain atleast 8 characters uppercase lowercase and number"
          res.redirect('/user-signup',)
        } else if ((userInfo.cpassword) != (userInfo.password)) {
        req.session.rmsg = "Password does not match"
          res.redirect('/user-signup')
        }else {
            const userData={
              name:userInfo.name,
              email:userInfo.email,
              phone:userInfo.phone,
              password:userInfo.password,
              status:true,
            }
            userData.password=await bcrypt.hash(userData.password,10)
          await userCollection.insertOne(userData).then((data) =>{
            console.log(data);
          })
          req.session.user=req.body
          res.redirect('/')
        }
      }
      catch(err){
        next(err)
       }
    },


    userLogin: (req, res) => {
      try{
         var user = req.session.user
        if (user) {
            res.redirect('/')
        } else {
            err = req.session.err
            res.render('users/user-login', {err})
            req.session.err = null
        }
      }
      catch(err){
        next(err)
       }
    },

    usercheck: async (req, res) => {
      try{
         const userInfo = {
            email: req.body.email,
            password: req.body.password,
        }
        var respons = {}

        var users = await userCollection.findOne({ email: userInfo.email })
        if (users) {
            if (users.status) {

                bcrypt.compare(userInfo.password, users.password).then((status) => {
                    if (status) {
                        console.log(status)
                        respons.user = users
                        respons.status = true
                        console.log("login successful")
                        req.session.user = respons.user
                        req.session.loggedIn=true
                        res.redirect('/')

                    } else {
                        respons.msg = "Invalid password"
                        req.session.err = respons.msg
                        res.redirect('/user-login')
                    }
                })

            } else {
                respons.msg = "Your account has been blocked"
                req.session.err = respons.msg
                res.redirect('/user-login')
            }
        }
        else {
            respons.msg = "invalid email"
            req.session.err = respons.msg
            res.redirect('/user-login')
        }
      }
      catch(err){
        next(err)
       } 
    },

    userShop:async(req,res,next)=>{
      try{
        let proCount=await products.countDocuments()
        const limit=4
        let skip=0
      
        const page=req.session.page
        if(page) skip=(page-1)*limit;
         let user = req.session.user
         let cartCount = null
         if (req.session.user) {
           cartCount = await getCount(req.session.user._id)
         }
         console.log("hehhee",cartCount);
      let categoryy = req.session.category
      var filtermsg;
      let price =  req.session.price
      let priceId = req.session.priceId
      let productList;
      console.log("price",price);
      console.log("priceId",priceId);
      let sort = req.session.sort
      let sortId = req.session.sortId
      console.log("sortttinggg",sortId);
      var categories = await category.find().toArray()
      

      if(priceId && sortId){
        console.log("hloooooooooooooo");
        if(sortId=='high-to-low'&& priceId=='below-10000'){
          console.log("eyyyyyyyyyy");
         productList=await  products.find({price:{$lt:10000}}).limit(limit).skip(skip).sort({price:-1}).toArray()
         proCount=await products.countDocuments({price:{$lt:10000}})
         console.log("looooog",productList);
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(sortId=='high-to-low'&& priceId=='below-20000'){
          console.log("koooi");
          productList=await  products.find({price:{$lt:20000}}).limit(limit).skip(skip).sort({price:-1}).toArray()
          proCount=await products.countDocuments({price:{$lt:20000}})
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(sortId=='high-to-low'&& priceId=='above-20000'){
          productList=await  products.find({price:{$gt:20000}}).limit(limit).skip(skip).sort({price:-1}).toArray()
        proCount=await products.countDocuments({price:{$gt:20000}})
          console.log("aaaaaaa",productList);
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(sortId=='low-to-high'&& priceId=='below-10000'){
          productList=await  products.find({price:{$lt:10000}}).limit(limit).skip(skip).sort({price:1}).toArray()
        proCount=await products.countDocuments({price:{$lt:10000}})
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(sortId=='low-to-high'&& priceId=='below-10000'){
          productList=await  products.find({price:{$lt:10000}}).limit(limit).skip(skip).sort({price:1}).toArray()
        proCount=await products.countDocuments({price:{$lt:10000}})
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(sortId=='low-to-high'&& priceId=='above-20000'){
          productList=await  products.find({price:{$gt:20000}}).limit(limit).skip(skip).sort({price:1}).toArray()
        proCount=await products.countDocuments({price:{$gt:20000}})
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
      }

      else if(priceId && categoryy){
        if(priceId=='below-10000'){
          productList=await  products.find({$and:[{price:{$lt:10000}},{category:categoryy.category}]}).limit(limit).skip(skip).toArray()
          proCount=await products.countDocuments({$and:[{price:{$lt:10000}},{category:categoryy.category}]})
          console.log("lllll",productList);
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(priceId=='below-20000'){
          console.log('gfdgjhkjlkjljl')
          productList=await  products.find({$and:[{price:{$lt:20000}},{category:categoryy.category}]}).limit(limit).skip(skip).toArray()
          proCount=await products.countDocuments({$and:[{price:{$lt:20000}},{category:categoryy.category}]})
          console.log("lllll",productList);
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(priceId=='above-20000'){
          productList=await  products.find({$and:[{price:{$gt:20000}},{category:categoryy.category}]}).limit(limit).skip(skip).toArray()
          proCount=await products.countDocuments({$and:[{price:{$gt:20000}},{category:categoryy.category}]})
          console.log("lllll",productList);
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
      }
      else if(sortId&&categoryy){
        if(sortId=='high-to-low'){
         productList= await products.find({category: categoryy.category }).sort({price:-1}).limit(limit).skip(skip).toArray()
         proCount=await products.countDocuments({category: categoryy.category })
         if(productList.length==0){
          filtermsg="No results found";
        }
        }else if(sortId=='low-to-high'){
          productList= await products.find({category: categoryy.category }).limit(limit).skip(skip).sort({price:1}).toArray()
          proCount=await products.countDocuments({category: categoryy.category })
          if(productList.length==0){
           filtermsg="No results found";
         }
         }
      }

         else if(categoryy){
          productList = await products.find({ category: categoryy.category }).limit(limit).skip(skip).toArray()
          proCount=await products.countDocuments({ category: categoryy.category })
          if(productList.length==0){
            filtermsg="No results found";
          }
         }
        else if(sortId=='low-to-high'){
          productList=await  products.find().sort({price:1}).limit(limit).skip(skip).toArray()
          proCount=await products.countDocuments()
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(sortId=='high-to-low'){
          productList=await  products.find().limit(limit).skip(skip).sort({price:-1}).toArray()
          proCount=await products.countDocuments()
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        
         else if(priceId=='below-10000'){
          productList=await  products.find({price:{$lt:10000}}).limit(limit).skip(skip).toArray()
          proCount=await products.countDocuments({price:{$lt:10000}})
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(priceId=='below-20000'){
          productList=await  products.find({price:{$lt:20000}}).limit(limit).skip(skip).toArray()
          proCount=await products.countDocuments({price:{$lt:20000}})
          console.log("hellloiiiiiiiiii",productList);
          if(productList.length==0){
            filtermsg="No results found";
          }
        }
        else if(priceId=='above-20000'){
          console.log("wwwwwwwwwwwwwwwww");
          productList=await  products.find({price:{$gt:20000}}).limit(limit).skip(skip).toArray()
          proCount=await products.countDocuments({price:{$gt:20000}})
          console.log("helllo",productList);
          if(productList.length==0){
            filtermsg="No results found";
          }
        }else{
          productList=await products.find().limit(limit).skip(skip).toArray();
          proCount=await products.countDocuments()
          //console.log("hiii",productList);
        }
        const count = Math.ceil(proCount/limit)
        const pageArr = [] 
        for(i=0;i<count;i++){
          pageArr.push(i+1)
        }
        //console.log("lkjhgfdsapiuytrew",productList);
        res.render('users/shop', { user, productList, filtermsg, categories,cartCount,pageArr })

      }
      catch(err){
        next(err)
       }
      },

      sessionCancel:(req,res)=>{
        req.session.category=null;
        req.session.price=null;
        req.session.priceId=null;
        req.session.sort=null;
        req.session.sortId=null;
        res.redirect('/user-shop')
      },

    searchData:async(req,res,next)=>{
      try{
         let payload=req.body.payload.trim();
      console.log("sdfgh",payload);
      let search=await products.find({pname:{$regex: new RegExp(payload+'.*','i')}}).toArray()
      console.log("search data",search);
      search=search.slice(0,10)
      res.send({payload:search}) 
      }
      catch(err){
        next(err)
       }
      },

    productDetails:async(req,res,next)=>{
      try{
         proId=req.params.id
        let user=req.session.user
       
      let cartCount = null
      if (req.session.user) {
        cartCount = await getCount(req.session.user._id)
      }
        let product=await products.findOne({_id:ObjectId(proId)})
        // let dprice =parseInt( Math.round(product.price - ((product.price * product.discount) / 100)))
        // console.log("discount" + dprice);
        res.render('users/product-detail', {user, product, id: req.params.id, user,cartCount })  
 
      }
      catch(err){
        next(err)
       }
    },

 


  addtoWishlist : async(req,res,next)=>{
    try{
       console.log("jjjooo");
    let productId = req.params.id;
    let userId = req.session.user._id;
    let productObject = {
      item: ObjectId(productId),
    }
    console.log("prod obj",productObject);
    let userWishList = await wishlist.findOne({ userId: ObjectId(userId)});
     if (userWishList) {
       let productExist = userWishList.products.findIndex(product => product.item == productId);
       if (productExist != -1) {
         res.redirect('/wishlist');
       }
       else {
         wishlist.updateOne({ userId: ObjectId(userId) }, { $push: { products: productObject } }).then((response) => {
           res.redirect('/wishlist');
         })
       }
     }
     else {
       let wishListObj = {
         userId: ObjectId(userId),
         products: [productObject]
       }
       wishlist.insertOne(wishListObj).then((response) => {
         res.redirect('/wishlist');
       })
     }
    }
    catch(err){
      next(err)
     }
   },


   


  wishList: async (req, res,next) => {
    try{
       
    let userId = req.session.user._id;
    let user = req.session.user
    let wishlistCounts = null
    if (req.session.user) {
      wishlistCounts = await wishlistCount(req.session.user._id)
    }
    console.log("iiiii",wishlistCounts);
    let cartCount = null
    if (req.session.user) {
      req.session.cartCount = await getCount(req.session.user._id)
    }
    let wishlistItems = await wishlist.aggregate([
      {
        $match: { userId: ObjectId(userId) }
      },
      {
        $unwind: '$products'
      },
      {
        $project: {
          item: '$products.item',
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'item',
          foreignField: '_id',
          as: 'products'
        }
      },
      {
        $project: {
          item: 1, products: { $arrayElemAt: ['$products', 0] }
        }
      }

    ]).toArray();
    console.log("wishhh", wishlistItems);
    res.render('users/wishlist', { user, wishlistItems,cartCount,});
    }
    catch(err){
      next(err)
     }
  },

     deletewishlist:(req,res,next)=>{
      try{
         proId=req.params.id
        console.log("iiiiiidddd",proId);
       let userId=req.session.user._id
       console.log("userrrrrr",userId);
       wishlist.updateOne({userId:ObjectId(userId)},{$pull:{products:{item:ObjectId(proId)}}})
       res.redirect('/wishlist')
      }
      catch(err){
        next(err)
       }
     },

    addressbook:async(req,res,next)=>{
      try{
         
    let userId=req.session.user._id;
    let user = req.session.user
      let cartCount = null
      if (req.session.user) {
        req.session.cartCount = await getCount(req.session.user._id)
      }
    let userData=await userCollection.findOne({_id:ObjectId(userId)})
    console.log("pranav"+userData.name);
    res.render('users/addressbook',{userData,user,cartCount})
      }
      catch(err){
        next(err)
       }
    },

    getAddress:async(req,res,next)=>{
      try{
         let userId=req.session.user._id
      let userdata=await userCollection.findOne({id:ObjectId(userId)})
      res.render('users/place-order')
      }
      catch(err){
        next(err)
       }
    },

    deleteAddress:(req,res,next)=>{
      try{
         let addressId=req.params.id
      let userId=req.session.user._id
      console.log("sdfg"+addressId);
      userCollection.updateOne({_id:ObjectId(userId)},{$pull:{address:{id:addressId}}})
      res.redirect('/addressbook')
      }
      catch(err){
        next(err)
       }
    },
    


    orderHistory:async (req,res,next) => {
      try{
        
      const userId = req.session.user._id;
      let user = req.session.user
      let cartCount = null
      if (req.session.user) {
        req.session.cartCount = await getCount(req.session.user._id)
      }
      console.log("usid",userId);
      const order = await orders.find({ userId:userId}).sort({_id:-1}).toArray()
      console.log("asdfgh"+order);
      console.log("iiiddd",order._id);
      res.render('users/order-history', { user, order,cartCount })
      
      }
      catch(err){
        next(err)
       }
    },

   



    
    orderedProducts: async (req, res,next) => {
      try{
        const orderId = req.params.id
     
      
      let user = req.session.user
      const userId = user._id
      let cartCount = null
      if (req.session.user) {
        req.session.cartCount = await getCount(req.session.user._id)
      }
      //const count = await globalFunction.cartCount(userId)
      let orderss=await orders.findOne({_id:ObjectId(orderId)})
      console.log("qqqqqqqqq",orderss);
    
          let orderdatas = await orders.aggregate([
            {
              $match: { _id:new ObjectId(orderId) }
            },
            {
              $unwind: '$products'
            },
            {
              $project: {
                item: '$products.item',
                quantity: '$products.quantity',
               
              }
            },
            {
              $lookup: {
                from: 'products',
                localField: 'item',
                foreignField: '_id',
                as: 'productDetails'
              }
            },
            {
              $project: {
                item: 1, quantity: 1, productDetails: { $arrayElemAt: ['$productDetails', 0] }
              }
            }
          ]).toArray();
          console.log(orderdatas);
          res.render('users/order-details',{orderdatas,user,orderss,cartCount})
      }
      catch(err){
        next(err)
       }
    },
   
    cancelOrder:async(req,res,next)=>{
      try{
         let orderId=req.params.id
      let userss=req.session.user;
      let userId=userss._id
      let t
      console.log("userId",userId);
      console.log("orderId",orderId);
      let orderdetails=await orders.findOne({_id:ObjectId(orderId)})
      dataAmt=orderdetails.totalAmount[0].total
      console.log("aaaaaaa",dataAmt);
      console.log("llllll",orderdetails);
      if(orderdetails.paymentMethod=='cod'){
        orders.updateOne({_id:ObjectId(orderId)},{$set:{status:"order-cancelled"}})
      }else{
        orders.updateOne({_id:ObjectId(orderId)},{$set:{status:"order-cancelled",paymentStatus:'return'}})
        userCollection.updateOne({_id:ObjectId(userId)},{$inc:{wallet:dataAmt}})
      }


    res.redirect('/order-history')
      }
     
      catch(err){
        next(err)
       }
      // 


  },

    userProfile: async(req,res,next)=>{
      try{
         let userId=req.session.user._id
     
     let user = req.session.user
      let cartCount = null
      if (req.session.user) {
        req.session.cartCount = await getCount(req.session.user._id)
      }
     var userData= await userCollection.findOne({_id:ObjectId(userId)})
     console.log("hiiiiii",userData);
     res.render('users/userProfile',{userData,userId,user,cartCount})
     
      }
      catch(err){
        next(err)
       }
    },

    userProfileEdit: async(req,res,next)=>{
      try{
        let userId=req.session.user._id
      
      let userdata=req.body
      console.log("userid"+userId);
      var userData= await userCollection.updateOne({_id:ObjectId(userId)},{$set:{
        name:userdata.name,
        email:userdata.email,
        phone:userdata.phone
      }}).then()
      console.log("hiiiiii",userData);
      res.redirect('/user-profile')
      }
      
      catch(err){
        next(err)
       }
     },

     selectAddress:async(req,res,next)=>{
      try{
        let id=req.params.id;
      console.log("id:"+id);
      let userId=req.session.user._id;
      let selectedAddress=await userCollection.aggregate([
        {
          $match:{_id:ObjectId(userId)}
        },
        {
          $unwind:'$address'
        },
        {
          $match:{'address.id':id}
        },
      ]).toArray();
      let data=selectedAddress[0].address;
      let name=selectedAddress[0].name;
      let arr=name.split(' ');
      let address={
        fname:arr[0],
        lname:arr[1],
        email:data.email,
        address:data.address,
        country:data.country,
        state:data.state,
        city:data.city,
        zip:data.zip,
        phone:data.phone
      }
      req.session.selectedAddress=address
      res.redirect('/place-order')

      }
      catch(err){
        next(err)
       }
     },
     removeOrder:async(req,res,next)=>{
      try{
         orderId=req.params.id
      await orders.deleteOne({_id:ObjectId(orderId)}).then(()=>{
        res.redirect('/order-history')
      })
      }
      catch(err){
        next(err)
       }
     },

     getCategoryFilter:async(req,res,next)=>{
      try{
        var response={}
      req.session.category=req.body
      res.json(response)
      }
      catch(err){
        next(err)
       }

     },

     getPriceFilter:async(req,res,next)=>{
      try{
         var response={}
      console.log(req.body)
      req.session.price=req.body
      req.session.priceId=req.body.id
      res.json(response)
      }
      catch(err){
        next(err)
       }
     },

     getPriceSort:async(req,res,next)=>{
      try{
         var response={}
      console.log(req.body)
      req.session.sort=req.body
      req.session.sortId=req.body.id
      res.json(response)
      }
      catch(err){
        next(err)
       }
     },


    //  getAll:async(req,res,next)=>{
      
    //   let var productList=await products.find().toArray()
    //   res.redirect('users/shop',{productList})
    //  }

    changePassword:(req,res,next)=>{
      try{
         var err= req.session.erMsg
      let userId=req.params.id
      res.render('users/changepswd',{err,userId})
      req.session.erMsg=null
      }
      catch(err){
        next(err)
       }
    },

    updatepswd:async(req,res,next)=>{
      try{
         var response = {};
  let userId = req.params.id;
  let data = req.body;
      let userExist = await userCollection.findOne({_id:ObjectId(userId)});
      console.log("uid = ",userId);
      console.log("userExist = ",userExist);
      if(userExist){
        console.log("Yes user exist! = ",userExist.name);
        console.log("data = ",data.password);
        console.log("base = ",userExist.password);
        bcrypt.compare(data.password,userExist.password).then(async (status)=>{
          if(status){
              console.log("status is true = ",data);
              // response.user = user;
              // response.status = true;
              // resolve(response);
              data.npassword = await bcrypt.hash(data.npassword,10);
              console.log("data.npassword = ",data.npassword);
              userCollection.updateOne({_id:ObjectId(userId)},{$set:{password:data.npassword}});
              
              // req.session.erMsg = "Password Changed";
              // window.alert("Password changed");
              res.redirect('/');
          }
           else{
          req.session.erMsg = "Invalid Password!";
          res.redirect('/change-password',+req.params.id);
      }
      })

  }
      }
      catch(err){
        next(err)
       }
    },
    invoice:async(req,res,next)=>{
      try{
       let user=req.session.user
        let userId=req.session.user._id
        let orderId=req.session.orderId
        console.log("id",userId);
        let order = await orders.findOne({_id:ObjectId(orderId)})
        console.log("ordessss",order);
        res.render('users/invoice',{user,order,orderId})  
      }
      catch(err){
        next(err)
       }
    },
    logout:(req,res,next)=>{
      try{
         req.session.user=null
      res.redirect('/')
      }
      catch(err){
        next(err)
       }
    },


    userAddress:async(req,res,next)=>{
    
        try{
          let users=req.session.user
     let userId=req.session.user._id;
     let userData=await userCollection.findOne({_id:ObjectId(userId)})
     console.log("pranav"+userData.name);
     res.render('users/userAddress',{userData,users})
       }
       catch(err){
         next(err)
        }
      },



      userEdit:(req,res,next)=>{
        try{

        }
        catch(err){
          next(err)
         }
      },

      editAddress:async(req,res)=>{
      try{
         let id=req.params.id;
        console.log("id:"+id);
        let userId=req.session.user._id;
        let selectedAddress=await userCollection.aggregate([
          {
            $match:{_id:ObjectId(userId)}
          },
          {
            $unwind:'$address'
          },
          {
            $match:{'address.id':id}
          },
        ]).toArray();
        let data=selectedAddress[0].address;
        let name=selectedAddress[0].name;
        let arr=name.split(' ');
        let address={
          fname:arr[0],
          lname:arr[1],
          email:data.email,
          address:data.address,
          country:data.country,
          state:data.state,
          city:data.city,
          zip:data.zip,
          phone:data.phone
        }
        req.session.selectedAddress=address
        res.render('users/edit-address',{address})
  
        }
      
       
        catch(err){
          next(err)
         }
      },


      addressEdit:async(req,res)=>{
        try{
          let data = req.body;
          let addressId = req.params.id;
          let userId = req.session.user._id;
          console.log("kooi",data);
          console.log("kooid",addressId);
          await userCollection.updateMany({_id:ObjectId(userId),"address.id":addressId},
          {
            $set : {"address.$.name":data.fname+" "+data.lname,"address.$.street":data.street,"address.$.state":data.state,"address.$.city":data.city,
            "address.$.zip":data.zipCode,"address.$.phone":data.phone,"address.$.email":data.email}
          });
          res.redirect('/user-address');
        }
        catch(err){
          next(err)
        }
         },
         pagination:async(req,res,next)=>{
          try{
              req.session.page = req.params.id
              res.redirect('/user-shop')
            }catch(err){
              next(err)
            }
      
      },
       contactUs:(req,res,next)=>{
            res.render('users/contact')
       },

       contact:(req,res,next)=>{
        try{
          let data = req.body;
          console.log("dddd",data);
        let response={}
          
              if(data){

              
                let mailTransporter = nodemailer.createTransport({
                    service : "gmail",
                    auth : {
                        user:'decorafurniture61@gmail.com',
                        pass:process.env.EMAIL_PASSWORD
                    }
                })
                
                let details = {
                    from:data.email,
                    to:'decorafurniture61@gmail.com',
                    name:data.name, 
                    subject:data.subject,
                    text:data.message
                }
      
                mailTransporter.sendMail(details,(err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Message Send Successfully ");
                        response.status=true;
                        console.log("hiiii");
                        res.json(response)
                    }
                })
              }
               
                }
                
                // resolve(response) 
              
             
        
        catch(err){
          next(err)
         }
        },

 about:(req,res,next)=>{
  res.render('users/about')
 }
   
}

       