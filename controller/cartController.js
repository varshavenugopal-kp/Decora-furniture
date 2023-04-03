const users = require('../model/userSchema')
var bcrypt = require('bcrypt')
const cart = require('../model/cartSchema')
const products = require('../model/productScema')
const coupons=require('../model/couponSchema')
const orders = require('../model/orderschema')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const uuid = require('uuid');
const { placeOrder } = require('../helpers/userhelpers');

const Razorpay = require('razorpay');
const crypto=require('crypto');
const { name } = require('../model/userSchema');
const { log, count } = require('console');
// const { count } = require('../model/userSchema');


var instance = new Razorpay({
  key_id:process.env.RAZORPAY_ID,
  key_secret:process.env.RAZORPAY_PASSWORD,
})



function getTotalAmount(userId) {
  return new Promise(async (resolve, reject) => {
    let cartamt = await cart.aggregate([
      {
        $match: { user: ObjectId(userId) }
      }, {
        $unwind: '$products'
      },
      {
        $project: {
          item: '$products.item',
          quantity: '$products.quantity'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'item',
          foreignField: '_id',
          as: 'products'
        },

      },
      {
        $project: {
          item: 1, quantity: 1, products: { $arrayElemAt: ['$products', 0] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$quantity', '$products.price'] } }
        }
      }

    ]).toArray()
    console.log("hhhhh", cartamt);


    resolve(cartamt)

  })

}

function getCount(userId) {
  return new Promise(async (resolve, reject) => {
    var count;
    let carts = await cart.findOne({ user: ObjectId(userId) })

    if (carts) {

      count = carts.products.length
    }
    if (!carts) {
      count = 0
    }
    resolve(count)

  })
}

function getCartProducts(userId, count) {
  console.log(userId);
  return new Promise(async (resolve, reject) => {
    let cartItems = await cart.aggregate([
      {
        $match: { user: ObjectId(userId) }
      }, {
        $unwind: '$products'
      },
      {
        $project: {
          item: '$products.item',
          quantity: '$products.quantity'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'item',
          foreignField: '_id',
          as: 'products'
        },

      },
      {
        $project: {
          item: 1, quantity: 1, products: { $arrayElemAt: ['$products', 0] }
        }
      }

    ]).toArray()
    //  console.log("jhsgduisfyu",cartItems);
    // console.log("cart==== ",cartItems[0]);
    console.log(count);
    if (count <= 0) {
      resolve()
    } else {
      resolve(cartItems)

    }
  })
}




module.exports = {
  addToCart: async (req, res,next) => {
    try{
       let proId = req.params.id;
    let userId = req.session.user._id;
    console.log(userId);
    let proObj = {
      item: ObjectId(proId),
      quantity: 1
    }
    let userCart = await cart.findOne({user:ObjectId(userId)})
    console.log("kkkkkkk", userCart);
    if (userCart) {
      let proExist = userCart.products.findIndex(products => products.item == proId)
      console.log(proExist);
      if (proExist != -1) {
       res.redirect('/cart')
      } else {
        cart.updateOne({ user: ObjectId(userId) }, { $push: { products: proObj } }).then((response) => {
          res.redirect('/cart');
        })
      }


    } else {
      let cartObj = {
        user: ObjectId(userId),
        products: [proObj],
      }
      cart.insertOne(cartObj).then((response) => {
        res.redirect('/cart');
      })
    }
    }
    catch(err){
      next(err)
     }
  },

  cartList: async (req, res, next) => {
    try {
      let user = req.session.user
      let userId = req.session.user._id
      
      let cartCount = null
      if (req.session.user) {
        cartCount = await getCount(req.session.user._id)
      }
      let count = await getCount(req.session.user._id)
      let total = await getTotalAmount(req.session.user._id)
      console.log("aaaaaaaaaaaaaaaaaaa  :  ", req.session.discountAmount);
      if (req.session.discountAmount) {
        total[0].total = req.session.discountAmount;
      }
      var err = req.session.rmsg
      console.log("jhbhjb", count);
      let coupon = await coupons.find().toArray()
      console.log(userId);
      if (count == 0) {
        res.render('users/cart',{user,cartCount})
      } else {




        let cartItems = await cart.aggregate([
          {
            $match: { user: ObjectId(userId) }
          }, {
            $unwind: '$products'
          },
          {
            $project: {
              item: '$products.item',
              quantity: '$products.quantity'
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: 'item',
              foreignField: '_id',
              as: 'products'
            },

          },
          {
            $project: {
              item: 1, quantity: 1, products: { $arrayElemAt: ['$products', 0] }
            }
          }

        ]).toArray()
        console.log(cartItems);
        console.log(count);
        if (count <= 0) {
          count = 0
        } else {
          // if(req.session.discountAmount){
          //   total[0].total=total[0].total-req.session.discountAmount
          //   console.log("total"+total[0].total);
          // }
          req.session.total = total[0].total

          res.render('users/cart', { cartItems, user, count, total, coupon, err })
          req.session.rmsg = null
        }
        console.log("last" + products);
      }
    }

    catch (err) {
      next(err)
    }


  },


  // router.post('/change-product-quantity',async(req,res,next)=>{
 
  //   let data=req.body
  //    userhelpers.changeQuantity(data).then(async(status)=>{
  //     console.log(status);
      
  //     let total=await userhelpers.getTotalAmount(req.session.user._id)
  //     status.total=total[0].total
  //     res.json(status)
  //   })
  // })


  changeProductQuantity:async(req,res)=>{
    try{
      console.log("hiiiiiiiiiiiiii");
    let response = {};
    usereId=req.session.user._id
    let data = req.body;
    console.log("help",data);
    data.count=parseInt(data.count)
    console.log("data.count=",data.count);
    data.quantity=parseInt(data.quantity)
    console.log("data.qty=",data.product);
    let stockDetails=await products.findOne({_id:ObjectId(data.products)})
   
      if(data.count==-1 && data.quantity==1){
        cart.updateOne({_id:ObjectId(data.cart)},
        {
          $pull:{products:{item:ObjectId(data.product)}}
        }
        ).then(async(response)=>{
          // resolve({removeProduct:true})
          console.log(response);
          res.json({removeProduct:true});
          let total=await getTotalAmount(req.session.user._id);
        })
      }

      
      // }
      // else if(data.quantity>(stockDetails.stock-1)&&data.count==1){
      //   console.log("out of stock");
      //   req.session.stock='Outofstock'
      //   response.stock="Outofstock"
      //   res.json(response)}

       
      else{
      cart.updateOne({_id:ObjectId(data.cart),'products.item':ObjectId(data.product)},
      {
        $inc:{'products.$.quantity':data.count}
      }).then(async(response)=>{
        
        response.status = true;
        let total=await getTotalAmount(req.session.user._id);
        console.log("gvfv",total);
         response.total = total;
         res.json(response);
      }
      )}
    
    }
    
    catch(err){
      next(err)
     }
  
  },

  cartDelete:(req,res)=>{
    try{
       proId=req.params.id
    console.log("iiiiiidddd",proId);
       let userId=req.session.user._id
       console.log("userrrrrr",userId);
       cart.updateOne({user:ObjectId(userId)},{$pull:{products:{item:ObjectId(proId)}}})
       res.redirect('/cart')
    }
    catch(err){
      next(err)
     }
  },


  

  // changeProductQuantity: async (req, res,next) => {
  //   let data = req.body
  //   let user = req.session.user
  //   let response={}
    
    //   userhelpers.changeQuantity(data).then(async(status)=>{
    //    console.log(status);

    //    let total=await userhelpers.getTotalAmount(req.session.user._id)
    //    status.total=total[0].total
    //    res.json(status)
    //  })
    // data.count = parseInt(data.count)
    // data.quantity=parseInt(data.quantity)

    // if(data.count==-1 && data.quantity==1){
    //   cart.updateOne({id:ObjectId(data.cart)},
    //   {
    //     $pull:{products:{item:ObjectId(data.products)}}
    //   }
    //   ).then(async(response)=>{
    //    res.json({removeProduct:true})
    //    let total = await getTotalAmount(req.session.user._id)
       
    //   })}else{
    //     cart.updateOne({_id:ObjectId(data.cart),'products.item':ObjectId(data.product)},
    // {
    //   $inc:{'products.$.quantity':data.count}
    // }).then(async(response)=>{
    //   let total = await getTotalAmount(req.session.user._id)
    //   response.status=true;
    //   response.total=total[0].total
    //   res.json(response);
    // })}
  
    //   },










    // cart.updateOne({ _id: ObjectId(data.cart), 'products.item': ObjectId(data.products) },
    //   {
    //     $inc: { 'products.$.quantity': data.count }
    //   }
    // ).then(async(response)=>{
    //   response.status=true;
    //   response.total=total[0].total
    //   res.json(response);
    // })
    //data.total = total[0].total
    // res.json(response)


  

  placeOrder: async(req, res,next) => {
    try{
       address=req.session.selectedAddress;

    let user = req.session.user
    let userId=req.session.user._id
    let total =await getTotalAmount(req.session.user._id)
    console.log("typeee",typeof(total));
    console.log("asdfghjklkjh",total);
     
     let userData=await users.findOne({_id:ObjectId(userId)})
    // console.log("asdfghj"+totalAmount);
    console.log("wallett",userData.wallet);
    if (req.session.total){
      total[0].total=req.session.total
    }
    
    res.render('users/checkout', {total, userId: req.session.user._id,address,userData,user })
    }
    catch(err){
      next(err)
     }
  },



  orderSubmit: async (req, res,next) => {
    try{
       let order = req.body
    const date=new Date()
    console.log("hello last",req.body);
    const options={
      year:'numeric',
      month:'2-digit',
      day:'2-digit',
      hour:'numeric',
      minute:'numeric',
      second:'numeric',
      hour12:true
    };
    let userId = req.session.user._id
    let product = await getCartProducts(req.session.user._id)
     let total = await getTotalAmount(req.session.user._id)
     total[0].total=req.session.total
     const formatDate=date.toLocaleString('en-US',options)
     const orderDate=formatDate
    let status = order['payment'] === 'cod' ? 'placed' : 'pending';
    let paymentStatus=order['payment']==='cod'?'not paid':'paid'
    if(order['payment']=='wallet'){
      status='placed'
      paymentStatus='paid'
    }
   

    let orderObject = {
      deliveryDetails: {
        id:uuid.v4(),
        name: order.first_name + " " + order.last_name,
        email: order.email,
        address: order.address,
        country: order.country,
        state: order.state,
        city: order.city,
        zip: order.zipCode,
        phone: order.phone
      },
      userId: userId,
      paymentMethod: order['payment'],
      paymentStatus:paymentStatus,
      
      products: product,
      totalAmount: total,
      status: status,
      date: orderDate,
      month:date.getMonth()+1,
    }
    let productCount = product.length;
    for (i = 0; i < productCount; i++) {
      qty = -(product[i].quantity)
      let productId = product[i].item

      products.updateOne({ _id: productId }, { $inc: { stock: qty } })

    }
    console.log("qqqq",order.save);
    if (order.save == 'true') {

      user.updateOne({ _id: ObjectId(userId) }, { $push: { address: orderObject.deliveryDetails } }).then((re) => {

      })
    }
    orders.insertOne(orderObject).then((response) => {
      cart.deleteOne({ user: ObjectId(userId) }).then((qq) => {
      let oId=response.insertedId
      req.session.orderId=response.insertedId
      console.log("ggggg",req.body['payment']);
      if(req.body['payment']=='cod'){
        res.json({cod:true})
      }
       else if(req.body['payment']=='wallet'){
        console.log("ffffffff",orderObject.totalAmount[0].total);
        let amount= -(parseFloat(orderObject.totalAmount[0].total));
        users.updateOne({_id:ObjectId(userId)},{$inc:{wallet:amount}});
        res.json({cod:true})
      }
      
        // if(status=='placed'){
        //   res.json({cod:true})
        // }
        else {
          console.log(total);
          let totalAmt = total[0].total
          // let totalAmt = total
          var options = {
            amount: totalAmt * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "" + oId
          };
          instance.orders.create(options, function (err, order) {
            if (err) {
              console.log(err);
            } else {
              console.log(order);
              res.json(order)
            }

          });

        }
    })
  })

    }
    catch(err){
      next(err)
     }
   
  
},

verifyPayment:async(req,res)=>{
  try{
     let details=req.body
  orderId=details['order[receipt]']
let hmac=crypto.createHmac('sha256','SbgEWipyuED1RfJJhKj4ZI19')
hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
hmac=hmac.digest('hex')
if(hmac==details['payment[razorpay_signature]']){
  orders.updateOne({_id:ObjectId(orderId)},
  {
    $set:{
      status:'placed'
    }
  })
console.log("gfhgfhjgkjh");
  res.json({status:true})
}else{
  res.json({status:false})

}
  }
  catch(err){
    next(err)
   }
},

orderPlaced:(req,res)=>{
  try{
    let user=req.session.user
  let orderId=req.session.orderId
  log("iiiiii",orderId)
  if(req.session.orderId){
    res.render('users/successpage',{user,orderId})
  }
  }
  catch(err){
    next(err)
   }
  
},
successPage:(req,res)=>{
  try{
    res.redirect('/success-page')
  }
  catch(err){
    next(err)
   }
},

showCoupons:async(req,res,next)=>{
  try{
     console.log("gyy");
  let total = await getTotalAmount(req.session.user._id)
  let count=await getCount(req.session.user._id)
  console.log("yyyy",total);
  let couponInfo=req.body.couponCode;
  let discountAmount
  console.log("asdfghjk"+couponInfo);
  
  let response={}
  
  let couponCode=await coupons.findOne({name:couponInfo})
  if(couponCode?.discountType=="percentage"){
    if(total[0].total>couponCode.amount&& count>couponCode.items){
       console.log("total",total[0].total,count);
       discountAmount= (total[0].total*couponCode.discount)/100
    }
    
  }else if(total[0].total>couponCode.amount && couponCode.items){
    console.log("inside",total[0].total,count);
    discountAmount=couponCode.discount;
  }else{
    console.log("input");
    discountAmount=0
  }
  let expiry=new Date(couponCode.date)
            let today=new Date()
            let exp=(expiry-today)/1000*60*60*24
            console.log(exp);
            // console.log(totalPrice);
           
  console.log("avavvavavavavavavavav",discountAmount);
  req.session.discountAmount= total[0].total-discountAmount
  console.log("disssss"+req.session.discountAmount);
  let cartCount=req.session.count
  console.log("total"+total[0].total);
 console.log("ccodde",couponCode);
  if(couponCode.amount>=total[0].total && couponCode.items>=count){
    console.log("vghvhv");
    req.session.rmsg="not eligible"
   console.log(req.session.rmsg);
   }
   else  if( exp<0 ){
    req.session.rmsg="date expired"
    console.log(req.session.rmsg);
   }
// }else{
//   if()
  res.json(response)

}
catch(err){
  next(err)
 }
  }
 



}