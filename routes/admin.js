var express = require('express');
const { response } = require('../app');
const adminhelpers = require('../helpers/adminhelpers');
const product = require('../model/productScema');
var nocache=require('nocache');
// const { deletProducts } = require('../helpers/adminhelpers');
const category = require('../model/categorySchema');
const adminController = require('../controller/adminController');
const admin = require('../model/adminSchema');
const cartController = require('../controller/cartController');
// const admin = require('../model/adminSchema');
var router = express.Router();


verifyLogin=(req,res,next)=>{
  let admin=req.session.admin
  if(admin)
  {
    next()
  }else{
    res.redirect('/admin/admin-login')
  }
}



router.get('/', verifyLogin, adminController.adminDashboard)

router.get('/getChart-Data', adminController.chartData)
router.get('/admin-login', nocache(), adminController.adminLogin)


router.post('/admin-login', adminController.adminCheck)


router.get('/user-list', verifyLogin, adminController.userlist)


router.get('/delet-user/:id', verifyLogin, adminController.userDelete)


router.get('/block-user/:id', verifyLogin, adminController.userBlock)

router.get('/unblock-user/:id', verifyLogin, adminController.userUnlock)


router.get('/product-add', verifyLogin, adminController.productAdd)
router.post('/product-add', adminController.addProduct)


router.get('/product-list', verifyLogin, adminController.productList)


router.get('/product-delete/:id', verifyLogin, adminController.productDelete)
router.get('/product-block/:id', verifyLogin, adminController.blockProduct);
router.get('/product-unblock/:id', verifyLogin, adminController.unblockProduct);



router.get('/product-edit/:id', verifyLogin, adminController.productEdit)


router.post('/product-edit/:id', verifyLogin, adminController.editProduct)


router.get('/category-add', verifyLogin, adminController.categoryAdd)

router.post('/category-add', verifyLogin, adminController.addCategory)


router.get('/category-edit/:id', verifyLogin, adminController.categoryEdit)



router.post('/category-edit/:id', verifyLogin, adminController.updateCategory)



router.get('/category-disable/:id', adminController.categoryDisable)
router.get('/category-enable/:id', adminController.categoryEnable)


router.get('/order-management/:id', verifyLogin, adminController.orderManage)

router.post('/order-management/:id', verifyLogin, adminController.updateOrderStatus)

router.get('/orders', verifyLogin, adminController.orderList)

router.get('/coupon-Add', verifyLogin, adminController.addCoupon)

router.post('/coupon-Add', verifyLogin, adminController.couponAdd)

router.get('/coupon-list', verifyLogin, adminController.couponList)

router.get('/coupon-edit/:id', verifyLogin, adminController.couponEdit)

router.post('/coupon-edit/:id', verifyLogin, adminController.couponUpdate)

router.get('/coupon-delete/:id', verifyLogin, adminController.couponDelete)

router.get('/banner-add', verifyLogin, adminController.addBanner)

router.post('/banner-add', verifyLogin, adminController.updateBanner)

router.get('/sales-report', adminController.salesReport)


module.exports = router;

