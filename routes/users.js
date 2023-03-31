var express = require('express');
const userhelpers = require('../helpers/userhelpers');
const user = require('../model/userSchema');
var router = express.Router();
var nocache=require('nocache');
const adminhelpers = require('../helpers/adminhelpers');
const userController=require('../controller/userController')
const cartController=require('../controller/cartController');
// const user = require("../model/userSchema");
// const { insertMany } = require('../model/userSchema');


/* Middleware */
verifyLogin=(req,res,next)=>{
  let user=req.session.user
  if(user)
  {
    next()
  }else{
    res.redirect('/user-login')
  }
}


/* GET home page. */
// router.get('/',nocache(),async function (req, res, next) {
//   let user=req.session.user
//   let cartCount=null
//   if(req.session.user){
//      cartCount=await userhelpers.getCount(req.session.user._id)
//   }
  
//   adminhelpers.getProducts().then((data)=>{
   
//     console.log(data);
//     res.render('users/home',{data,user,cartCount});
//   })
  
// });

router.get('/',nocache(),userController.getProducts);

router.get('/otp-login',userController.getOtpLogin)

router.get('/reset-password',userController.resetpswd);
router.post('/reset-password',userController.pswdreset);

router.get('/password-otp',userController.otpPaswd);
router.post('/password-otp',userController.verifyOtp)
router.post('/otp-verify',userController.pswdOtp);



router.post('/otp-login',userController.otpVerification)

router.post('/verify-otp',userController.otpLogin)

 router.get('/user-signup',userController.userSignup)

 router.post('/user-signup',userController.insertUser)
  


router.get('/user-login',nocache(),userController.userLogin)

router.post('/user-login',userController.usercheck)



 router.get('/user-shop',userController.userShop)

 router.get('/session-delet',userController.sessionCancel)
// router.get('/user-shop',async(req,res)=>{
//   let user=req.session.user
//   let cartCount=null;
//   if(req.session.user){
//     cartCount=await userhelpers.getCount(req.session.user._id)
//  }
//  let shop=await adminhelpers.showCategory()
//  console.log("shop",shop);
//   adminhelpers.getProducts().then((productList)=>{
//     res.render('users/shop',{productList,user,shop,cartCount})
//   })
 
// })

router.get('/product-details/:id',userController.productDetails)



router.get('/add-to-cart/:id',verifyLogin,cartController.addToCart)
// (req,res)=>{

//     console.log("api call");
//     console.log(req.session.user);
//   userhelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
//     res.redirect('/cart')
    
//   })
// })


router.get('/cart',verifyLogin,cartController.cartList)
router.post('/change-product-quantity',verifyLogin,cartController.changeProductQuantity)
router.get('/cart-delete/:id',cartController.cartDelete)
// async(req,res)=>{
//   let user=req.session.user
//   cartCount=await userhelpers.getCount(req.session.user._id)
//   let total=await userhelpers.getTotalAmount(req.session.user._id)

// await userhelpers.getCartProducts(req.session.user._id,cartCount).then((products)=>{
//   console.log("last"+products);
//   res.render('users/cart',{products,user,cartCount,total})
// })
router.get('/wishlist',verifyLogin,userController.wishList)
router.get('/add-to-wishlist/:id',verifyLogin,userController.addtoWishlist)
router.get('/wishlist-delete/:id',verifyLogin,userController.deletewishlist)


router.post('/getProducts',userController.searchData)
router.get('/change-password/:id',userController.changePassword)
router.post('/change-password/:id',userController.updatepswd)






router.get('/place-order',verifyLogin,cartController.placeOrder)
// async(req,res)=>{
  
//   let total=await userhelpers.getTotalAmount(req.session.user._id)
 
//  res.render('users/checkout',{total,user:req.session.user._id})

// })

router.post('/place-order',verifyLogin,cartController.orderSubmit)

  // let products=await userhelpers.getCartProducts(req.session.user._id)
  // let total=await userhelpers.getTotalAmount(req.session.user._id)
  // userhelpers.placeOrder(req.body,products,total,req.session.user._id).then((response)=>{
    // res.json({status:true})
//     res.redirect('/place-order')
//   })
router.get('/cancel-order/:id',verifyLogin,userController.cancelOrder)

// })
router.post('/verify-payment',verifyLogin,cartController.verifyPayment)
router.get('/success-page',verifyLogin,cartController.orderPlaced)
// router.get('/success-page',verifyLogin,cartController.successPage)

router.get('/addressbook',verifyLogin,userController.addressbook)

// router.get('/order-history',verifyLogin,userController.orderHistory)
router.get('/user-profile',verifyLogin,userController.userProfile)
router.post('/user-profile',verifyLogin,userController.userProfileEdit)

router.get('/order-history',verifyLogin,userController.orderHistory)
router.get('/order-details/:id',verifyLogin,userController.orderedProducts)

router.get('/select-address/:id',verifyLogin,userController.selectAddress)

router.get('/delete-address/:id',verifyLogin,userController.deleteAddress)

router.get('/remove-order/:id',verifyLogin,userController.removeOrder)

router.post('/show-coupons',cartController.showCoupons)

router.post('/category-filter',userController.getCategoryFilter)

router.post('/price-filter',userController.getPriceFilter)
router.post('/price-sort',userController.getPriceSort)
router.get('/logout',userController.logout)
router.get('/invoice/:id',userController.invoice)

router.get('/user-address',verifyLogin,userController.userAddress)
router.get('/edit-address/:id',userController.editAddress)
router.post('/edit-address',userController.addressEdit)

router.get('/pagination/:id',userController.pagination)

//router.get('/get-products',userController.getAll)
 module.exports = router;