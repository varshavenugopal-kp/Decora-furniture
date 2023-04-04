const admin = require('../model/adminSchema');
const user = require('../model/userSchema');
const mongoose=require('mongoose');
const { set, response } = require('../app');
const orders=require('../model/orderschema')
const product = require('../model/productScema');
const category = require('../model/categorySchema');
const coupons = require('../model/couponSchema')
const uuid = require('uuid');
const coupon = require('../model/couponSchema');
const sharp = require('sharp');
const { findOne } = require('../model/orderschema');
const {ObjectId} = mongoose.Types;

module.exports={

    adminDashboard:async(req,res,next)=>{
        try{
            let userCount=await user.countDocuments();
            let orderCount=await orders.countDocuments();
            let productCount=await product.countDocuments();
            let revenueData = await orders.aggregate([
                {
                  $match: { paymentStatus: 'paid' } 
                },
                {
                  $unwind : '$totalAmount'
                },
                {
                  $group : {_id:null,revenue:{$sum:'$totalAmount.total'}}
                }
              ]).toArray();
              console.log("adminn",revenueData);
              console.log("hhhhhhhhh",revenueData);
           res.render('admin/dashboard-admin',{userCount,orderCount,productCount,revenue:revenueData[0].revenue})
        }
        catch(err){
           next(err)
        }
    },
    chartData:async(req,res,next)=>{
      try{
         let monthWise=await orders.aggregate([
            {
                $match:{paymentStatus:'paid'}
            },
            {
                $unwind:'$totalAmount'
            },
            {
                $group:{_id:'$month',revenue:{$sum:'$totalAmount.total'}}
            },
            {
                $sort:{_id:1}
            }
         ]).toArray();
         console.log("a=monthwise",monthWise);
         res.json(monthWise)
      }
      catch(err){
          next(err)
      }
    },

  
    adminLogin:(req,res,next)=>{
        
        try{
            var admin = req.session.admin;
            if(admin){
                console.log("admin");
              res.redirect('/')
            }else{
                err=req.session.err
              // console.log("error"+err);
              res.render('admin/admin-login',{err})
              req.session.err=null;
        }
        }
       catch(err){
        next(err)
       }
},
    adminCheck: async (req,res,next) => {
        try{
            const adminInfo = {
            email: req.body.email,
            password: req.body.password
        }
        var respons = {}
        var adminData = await admin.findOne({ email: adminInfo.email })
        if (adminData) {
            if (adminInfo.password == adminData.password) {
                respons.admin = adminData
                respons.status = true
                console.log("login successful")
                console.log(respons.admin);
                req.session.admin = respons.admin
                res.redirect('/admin')
            } else {
                respons.err = "invalid password"

                
                req.session.err = respons.err
                
                res.redirect('/admin/admin-login')
            }
        } else {
            respons.err = "invalid email"
            req.session.err = respons.err
            // req.session.err = response.msg
            res.redirect('/admin/admin-login')
        }
        }
        
        catch(err){
            next(err)
           }

    },


   

    userlist:async(req,res,next)=>{
        try{
          var admin=req.session.admin
  if(admin){
    var userList=await user.find().sort({_id:-1}).toArray()
    res.render('admin/userlist',{admin,userList})
    }else{
  res.redirect('/admin/admin-login')
 }  
        }
        catch(err){
            next(err)
           }
    },

userDelete:async(req,res,next)=>{
    try{
         var userId=req.params.id
    await user.deleteOne({_id:ObjectId(userId)})
    res.redirect('/admin/user-list')
    }
    catch(err){
        next(err)
       }
},

userBlock:async(req,res,next)=>{
    try{
         var userId=req.params.id
    await user.updateOne({_id:ObjectId(userId)},{$set:{status:false}})
    res.redirect('/admin/user-list')
    }
    catch(err){
        next(err)
       }
},

userUnlock:async(req,res,next)=>{
    try{
         var userId=req.params.id
    user.updateOne({_id:ObjectId(userId)},{$set:{status:true}})
    res.redirect('/admin/user-list')
    }
    catch(err){
        next(err)
       }
},
productAdd:async(req,res,next)=>{
    try{
         let categoryData=await category.find().toArray()
    var err=req.session.msg
    info=req.session.info
    res.render('admin/product',{err,categoryData,info})
    req.session.msg=null
    req.session.info=null
    }
    catch(err){
        next(err)
       }

},
addProduct:async(req,res,next)=>{
    try{
        image = req.files.image
    productInfo=req.body
   req.session.info=req.body
    var rmsg
            var nameRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
            var priceRegex =/^([0-9.]){1,}$/i;
            var paraRegex = /^(.|\s)*[a-zA-Z]+(.|\s)*$/;

            if(productInfo.pname==''){
                rmsg="product name cannot be empty"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
            }


            else if(nameRegex.test(productInfo.pname)!=true){
               rmsg="enter valid product name"
               req.session.msg=rmsg
      res.redirect('/admin/product-add')
            }else if(productInfo.brand==''){
                rmsg="brand name cannot be empty"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
            }
            else if(nameRegex.test(productInfo.brand)!=true){
                rmsg="enter valid product brand"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
             }
             else if(productInfo.price==''){
                rmsg="price cannot be empty"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
            }else if(priceRegex.test(productInfo.price)!=true){
                rmsg="enter valid price"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
            }
               else if(productInfo.category==''){
                rmsg="catagory cannot be empty"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
            }
            else if(priceRegex.test(productInfo.stock)!=true){
                rmsg="enter valid product stock"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
             }else if(productInfo.stock==''){
                rmsg="stock cannot be empty"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
            }
            
            else if(paraRegex.test(productInfo.desc)!=true){
                rmsg="enter valid description"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
            }else if(productInfo.desc==''){
                rmsg="description cannot be empty"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
            }else if(image.length<1){
             rmsg="Add minimum 1 image"
             req.session.msg=rmsg
             res.redirect('/admin/product-add')
            }
             else if(image.length>3){
                rmsg="Add maximum 3 images"
                req.session.msg=rmsg
      res.redirect('/admin/product-add')
             }
             else{
                count = image.length
                imgId = []
                if(count){
                    for(i=0;i<count;i++){
                     imgId[i]=uuid.v4()
                     image[i].mv('./public/product-images/'+imgId[i]+'.jpg',(err,done)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log("done")
                        }
                     })
                    }
                }else{
                    imgId[0]=uuid.v4()
                    image.mv('./public/product-images/'+imgId[0]+'.jpg',(err,done)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log("done")
                        }
                     })
                }
                productInfo.price=parseInt(productInfo.price)
                productInfo.stock=parseInt(productInfo.stock)
                productInfo.discount=parseInt(productInfo.discount)
                productInfo.image = imgId
    //             console.log("info==",productInfo);
    //             product.insertOne(productInfo).then((data)=>{
    //                 req.session.product=req.body
    //   res.redirect('/admin/product-add')
    //             })


    const productData={
        pname:productInfo.pname,
        brand:productInfo.brand,
        category:productInfo.category,
        price:productInfo.price,
        stock:productInfo.stock,
        discount:productInfo.discount,
        desc:productInfo.desc,
        image:productInfo.image,
        status:true,
    }
    console.log("ggg",typeof(discount));
    console.log("daaaaaaaaata",productData);
    product.insertOne(productData).then((data)=>{
                        req.session.product=req.body
          res.redirect('/admin/product-add')
                    })
             }
      


    }
    catch(err){
        next(err)
       }
},

blockProduct:async(req,res,next)=>{
    try{
         let proId=req.params.id
 let daataas=await product.updateOne({_id:ObjectId(proId)},{$set:{status:false}})
 console.log("daataasss",daataas);
 res.redirect('/admin/product-list')
    }
    catch(err){
        next(err)
       }
},

unblockProduct:async(req,res,next)=>{
    try{
         let proId=req.params.id
    await product.updateOne({_id:ObjectId(proId)},{$set:{status:true}})
    res.redirect('/admin/product-list')
    }
    catch(err){
        next(err)
       }
   },

productList:async(req,res,next)=>{
    try{
         var productList=await product.find().sort({_id:-1}).toArray()
    res.render('admin/product-list',{productList})
    }
    catch(err){
        next(err)
       } 
},

productDelete:(req,res,next)=>{
    try{
         productId=req.params.id
    product.deleteOne({_id:ObjectId(productId)})
    res.redirect('/admin/product-list')
    }
    catch(err){
        next(err)
       } 
},

productEdit:async(req,res,next)=>{
    try{
         var productId=req.params.id
    let categoryData=await category.find().toArray()
    console.log("nihaaal",categoryData);
    products=await product.findOne({_id:ObjectId(productId)})
    
    res.render('admin/product-edit',{products,categoryData})
    }
    catch(err){
        next(err)
       }
},

editProduct:(req,res,next)=>{
    try{
         productId=req.params.id;
    console.log("proiid"+productId);
    productInfo=req.body;
    product.updateOne({_id:ObjectId(productId)},{$set:{
        name:productInfo.pname,
        brand:productInfo.brand,
        catagory:productInfo.category,
        price:productInfo.price,
        stock:productInfo.stock,
        discount:productInfo.discount,
        description:productInfo.desc,
     }}).then(()=>{
        obj=req.files;
        
        if(obj)
        {
            const count=Object.keys(obj).length
            for(i=0;i<count;i++){
                imgId=Object.keys(obj)[i]
                image=Object.values(obj)[i]
                console.log("imaaaage",imgId);
                image.mv('./public/product-images/'+imgId+'.jpg').then((err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("done")
                    }
                 })
            }
            res.redirect('/admin/product-add')
        }
        else{
            res.redirect('/admin/product-list')
        }
       
     }) 
     
    }
   catch(err){
        next(err)
       }
},

categoryAdd:async(req,res,next)=>{
    try{
       var err=req.session.msg;
     editCategoryData=req.session.editCategory;
     console.log("edit data",editCategoryData);
    var categoryData=await category.find().toArray()
    res.render('admin/category',{err,categoryData,editCategoryData})
    req.session.msg=null
    req.session.editCategory=null; 
    }
    catch(err){
        next(err)
       }
       
},

addCategory:async(req,res,next)=>{
    try{
        categoryInfo=req.body;
    console.log("cat info",categoryInfo);
    let categoryData=await category.findOne({category:categoryInfo.category})
    var respons={}
    var msg
        var nameRegex = /^([A-Za-z_ ]){3,20}$/i;
        if(categoryInfo.category==''){
            msg='enter a category'
            req.session.msg=msg
            res.redirect('/admin/category-add')
        }else if(nameRegex.test(categoryInfo.category)!=true){
            msg='enter valid category'
            req.session.msg=msg
            res.redirect('/admin/category-add')
        }else if(categoryData){
            msg='Already exist'
            req.session.msg=msg
            res.redirect('/admin/category-add')
        }
        else{

            catdata={
                category:categoryInfo.category,
                status:true
            }
            await category.insertOne(catdata).then((data)=>{
                respons.id=data.insertedId
              })
              if(respons.id){
                    res.redirect('/admin/category-add')
                 }else{
                    req.session.msg=data
                    res.redirect('/admin/category-add')
                 }
                
               
        
        }
    }
    catch(err){
        next(err)
       }
    
},

categoryEdit:async(req,res,next)=>{
    try{
        var categoryId=req.params.id;
  console.log("iddddddd",categoryId);
  categoryData=await category.findOne({_id:ObjectId(categoryId)})
  console.log("cat data",categoryData);
  req.session.editCategory=categoryData.category;
  res.redirect('/admin/category-add')
    }
    catch(err){
        next(err)
       }

},

updateCategory:async(req,res,next)=>{
    try{
         categoryId=req.params.id
  let updateData=req.body
  await category.updateOne({_id:ObjectId(categoryId)},{$set:{category:updateData.catagory}})
  res.redirect('/admin/category-edit/'+req.params.id)
    }
    catch(err){
        next(err)
       }
},

categoryDisable:async(req,res,next)=>{
    try{
         let categoryId=req.params.id
    categoryData=await category.findOne({_id:ObjectId(categoryId)})
    data=categoryData.category
    console.log("wwwww",categoryId);
    console.log("daaata",data);
    category.updateOne({_id:ObjectId(categoryId)},{$set:{status:false}})
    product.updateMany({category:data},{$set:{status:false}})
    
   res.redirect('/admin/category-add')
    }
    catch(err){
        next(err)
       }
},

categoryEnable:async(req,res,next)=>{
    try{
         let categoryId=req.params.id
    categoryData=await category.findOne({_id:ObjectId(categoryId)})
    data=categoryData.category
    console.log("wwwww",categoryId);
    console.log("daaata",data);
    category.updateOne({_id:ObjectId(categoryId)},{$set:{status:true}})
    product.updateMany({category:data},{$set:{status:true}})
   res.redirect('/admin/category-add')
    }
    catch(err){
        next(err)
       }
},

orderManage:async(req,res,next)=>{
    try{
         orderId=req.params.id;
    orderDetails=await orders.findOne({_id:ObjectId(orderId)})

    res.render('admin/orderManage',{orderDetails,orderId})
    }
    catch(err){
        next(err)
       }
},
updateOrderStatus:async(req,res,next)=>{
    try{
        let orderStatus=req.body.order;
        console.log("kkkkkkkkkkkkk",orderStatus);
  let orderId=req.body.orderId;
  
  await orders.updateOne({_id:ObjectId(orderId)},{$set:{status:orderStatus}})
  res.redirect('/admin/order-management/'+orderId)
    }
    catch(err){
        next(err)
       }
},
orderList:async(req,res,next)=>{
    try{
         orderList=await orders.find().sort({_id:-1}).toArray()
  res.render('admin/orders',{orderList})
    }
    catch(err){
        next(err)
       }
},

addCoupon:(req,res,next)=>{
    try{
        var err=req.session.msg
    res.render('admin/add-coupon',{err})
    req.session.msg=null
    }
    
    catch(err){
        next(err)
       }
},

couponAdd:(req,res,next)=>{
    try{ couponInfo=req.body
    // var nameRegex = /^([A-Za-z ]){5,25}$/gm;
    // var typeRegex = /^([A-Za-z0-9_ ]){3,20}$/i;
    //         var amountRegex =/^([0-9.]){1,}$/i;
    //         var discountRegex =/^([0-9.]){1,}$/i;
    //         var itemRegex =/^([0-9.]){1,}$/i;
    //         var dateRegex=/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
    //         var rmsg
    //         if(couponInfo.name==''){
    //            rmsg="Coupon name should not empty"
    //            req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(nameRegex.test(couponInfo.name)){
    //             rmsg="Invalid coupon name"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(couponInfo.date==''){
    //             rmsg="Date should not empty"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(dateRegex.test(couponInfo.date)){
    //             rmsg="Invalid Date"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(couponInfo.items==''){
    //             rmsg="Items should not empty"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(itemRegex.test(couponInfo.items)){
    //             rmsg="Invalid Item"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(couponInfo.amount==''){
    //             rmsg="Amount should not empty"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(amountRegex.test(couponInfo.amount)){
    //             rmsg="Invalid Amount"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(couponInfo.discountType==''){
    //             rmsg="Coupon name should not empty"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(typeRegex.test(couponInfo.discountType)){
    //             rmsg="Invalid discount type"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(couponInfo.discount==''){
    //             rmsg="Discount should not empty"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else if(discountRegex.test(couponInfo.discount)){
    //             rmsg="Invalid discount type"
    //             req.session.msg=rmsg
    //   res.redirect('/admin/coupon-Add')
    //         }else{

    couponInfo.items=parseInt(couponInfo.items)
    couponInfo.amount=parseInt(couponInfo.amount)
    couponInfo.discount=parseInt(couponInfo.discount)
    coupon.insertOne(couponInfo).then((data)=>{
        res.redirect('/admin/coupon-add')
    })
}
catch(err){
    next(err)
   }
},
couponList:async(req,res,next)=>{
    try{
         couponList=await coupon.find().toArray();
  res.render('admin/coupon-list',{couponList})
    }
    catch(err){
        next(err)
       }
},
couponEdit:async(req,res,next)=>{
    try{
         let couponId=req.params.id
    let coupons=await coupon.findOne({_id:ObjectId(couponId)})
    res.render('admin/coupon-edit',{coupons})
    }
    catch(err){
        next(err)
       }
},

couponUpdate:(req,res,next)=>{
    try{
       couponId=req.params.id;
   couponInfo=req.body
   coupon.updateOne({_id:ObjectId(couponId)},{$set:{
    name:couponInfo.name,
    date:couponInfo.date,
    items:couponInfo.items,
    amount:couponInfo.amount,
    dicountType:couponInfo.discountType,
    discount:couponInfo.discount
   }})
    res.redirect('/admin/coupon-list') 
    }
    catch(err){
        next(err)
       }
   
},
addBanner:async(req,res,next)=>{
    try{
        res.render('admin/banner')
    }
    catch(err){
        next(err)
       }
},
updateBanner:async(req,res,next)=>{
    try{
         console.log("Wereeeee");
    console.log("filesss",req.files);
if(req.files?.bannerImage){
    let path=req.files.bannerImage.tempFilePath;
    await sharp(path)
    .rotate()
    .resize(1160,490)
    .jpeg({mozjpeg:true})
    .toFile('./public/banner-images/banner.jpg')
}
res.redirect('/admin/banner-add')
    }
    catch(err){
        next(err)
       }
},
couponDelete:(req,res,next)=>{
    try{
         couponId=req.params.id;
    coupon.deleteOne({_id:ObjectId(couponId)})
    res.redirect('/admin/coupon-list')
    }
    catch(err){
        next(err)
       }
},
salesReport:async(req,res,next)=>{
    try{
     sales=await orders.find().toArray()
       console.log("daaataa",sales);
       res.render('admin/salesreport',{sales})   
    }
    
    catch(err){
        next(err)
       } 
  
},




}
