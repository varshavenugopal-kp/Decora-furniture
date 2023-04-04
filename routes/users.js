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

router.get('/product-details/:id',userController.productDetails)



router.get('/add-to-cart/:id',verifyLogin,cartController.addToCart)

router.get('/cart',verifyLogin,cartController.cartList)
router.post('/change-product-quantity',verifyLogin,cartController.changeProductQuantity)
router.get('/cart-delete/:id',cartController.cartDelete)

router.get('/wishlist',verifyLogin,userController.wishList)
router.get('/add-to-wishlist/:id',verifyLogin,userController.addtoWishlist)
router.get('/wishlist-delete/:id',verifyLogin,userController.deletewishlist)


router.post('/getProducts',userController.searchData)
router.get('/change-password/:id',userController.changePassword)
router.post('/change-password/:id',userController.updatepswd)


router.get('/place-order',verifyLogin,cartController.placeOrder)


router.post('/place-order',verifyLogin,cartController.orderSubmit)

 
router.get('/cancel-order/:id',verifyLogin,userController.cancelOrder)


router.post('/verify-payment',verifyLogin,cartController.verifyPayment)
router.get('/success-page',verifyLogin,cartController.orderPlaced)


router.get('/addressbook',verifyLogin,userController.addressbook)


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
router.get('/logout',verifyLogin,userController.logout)
router.get('/invoice/:id',verifyLogin,userController.invoice)

router.get('/user-address',verifyLogin,userController.userAddress)
router.get('/edit-address/:id',verifyLogin,userController.editAddress)
router.post('/edit-address/:id',verifyLogin,userController.addressEdit)

router.get('/pagination/:id',userController.pagination)

router.get('/contact',verifyLogin,userController.contactUs)
router.post('/contact',verifyLogin,userController.contact)

router.get('/about',userController.about)


 module.exports = router;