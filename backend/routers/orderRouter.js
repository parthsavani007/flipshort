// import express from 'express';
// import { orderModel as Order, shippingModel as Shipping } from '../models/orderModel';
// const mongoose = require("mongoose");
// const Razorpay = require("razorpay");
// import config from '../../backend/config';

// import Product from '../models/productModel'
// import { isAuth, isAdmin, isSellerOrAdmin, transport, payOrderEmailTemplate } from '../util';
// import User from '../models/userModel.js';
// // const nodemailer = require('nodemailer');

// const router = express.Router();


// router.get('/summary', isAuth, isAdmin, async (req, res) => {
//   try {
//     const orders = await Order.aggregate([
//       {
//         $group: {
//           _id: null,
//           numOrders: { $sum: 1 },
//           totalSales: { $sum: '$totalPrice' },
//         },
//       },
//     ]);
//     const users = await User.aggregate([
//       {
//         $group: {
//           _id: null,
//           numUsers: { $sum: 1 },
//         },
//       },
//     ]);
//     const dailyOrders = await Order.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//           orders: { $sum: 1 },
//           sales: { $sum: '$totalPrice' },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);
//     const productCategories = await Product.aggregate([
//       {
//         $group: {
//           _id: '$category',
//           count: { $sum: 1 },
//         },
//       },
//     ]);
//     res.send({ users, orders, dailyOrders, productCategories });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send(error.message);
//   }
// });

// router.get('/address', isAuth, async (req, res) => {
//   //var a = '628e9de6fb0770733a442eed';
  
//   const newshipping = await Shipping.find({ 'user': mongoose.Types.ObjectId(req.user._id) });
//   try {
//     if (newshipping) {

//       return res
//         .status(201)
//         .send({ message: 'New Address Added', data: newshipping });
//     }
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send(error.message);
//   }
// });

// router.delete('/address/:id', isAuth, async (req, res) => {
  
//   const address = await Shipping.findById(req.params.id);
//   if (address) {
//     const deleteOrder = await address.remove();
//     res.send({ message: 'Address Deleted', order: deleteOrder });
//   } else {
//     res.status(404).send({ message: 'Address Not Found' });
//   }
// });

// router.get("/:id", isAuth, async (req, res) => {

//   const order = await Order.findOne({ _id: req.params.id }).populate(
//     'user',
//     'email name'
//   );
//   if (order) {
//     const updatedOrder = await order.save();


//     res.send(order);
//   } else {
//     res.status(404).send("Order Not Found.")
//   }
// });



// router.get("/mine", isAuth, async (req, res) => {

//   console.log(req.user)
//   try {
//     const orders = await Order.find({}).populate('user');
//     //const orders = await Order.find({user:req.user._id}).populate('user');
//     // 
//     res.send(orders);
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send(error.message);
//   }
// });



// router.get('/', isAuth,

//   async (req, res) => {

//     const seller = req.query.seller || '';
//     const sellerFilter = seller ? { seller } : {};

//     const orders = await Order.find({ ...sellerFilter, }).populate('user','firstName');;
//     // console.log(orders
//     res.send(orders);
//   }
// );

// router.put('/:id/pay', isAuth, async (req, res) => {
//   console.log("pay")
 
//   const order = await Order.findById(req.params.id).populate(
//     'user',
//     'email name'
//   );
//   try {

//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.payment = {
//       paymentMethod: 'razorpay',
//       paymentResult: {
//         payerID: req.body.razorpay_signature,
//         orderID: req.body.razorpay_order_id,
//         paymentID: req.body.razorpay_payment_id
//       }
//     }
//     const updatedOrder = await order.save();
//     // const mailOptions = {
//     //   from: "kukadiyadenish@gmail.com",
//     //   to: `${order.user.name} <${order.user.email}>`,
//     //   subject: `New order ${order._id}`,
//     //   text: 'Hello to myself!',
//     //   html: payOrderEmailTemplate(order),

//     // };
//     // transport.sendMail(mailOptions, (err, info) => {
//     //   if (err) {
//     //     console.log('Error occurred. ' + err.message);
//     //     return process.exit(1);
//     //   }

//     //   console.log('Message sent: %s', info.messageId);
//     //   // Preview only available when sending through an Ethereal account
//     //   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//     // });


//     console.log("send");
//     res.send({ message: 'Order Paid.', order: updatedOrder });
//   }
// }catch(error){
//   return res.status(500).send({ message: ' Error in Updating Order.' });
// }
 
// });


// router.post('/', isAuth, async (req, res) => {

//   const razorpay = new Razorpay({
//     key_id: config.R_KeyId,
//     key_secret: config.RAZOR_PAY_KEY_SECRET,
//   });

// console.log(parseInt(req.body.total));
//   const options = {
//     amount: parseInt(req.body.total)*100,
//     currency: 'INR',
//   };
//   var order;
//   try {
//     if(req.body.paymentMethod == 'razorpay'){
//       order = await razorpay.orders.create(options);
//       console.log(order);
//       if (!order) return res.status(500).send('Some error occured');
//     }
    
    
// 	} catch (error) {
//     console.log(error)
//     return res.status(400).send(error.message);
	
// 	}
  

//   var paymentMethod = {'paymentMethod': req.body.paymentMethod}
//   const newOrder = new Order({
//     orderItems: req.body.orderItems,
//     user: req.user._id,
//     shipping: req.body.shippingAddress,
//     payment: paymentMethod,
//     subtotal: req.body.subtotal,
//     total: req.body.total,
//     discount: req.body.discount,
//     shippingPrice: req.body.shipping,
//     payment : {
//       paymentMethod: req.body.paymentMethod,
//       paymentResult: {
//         payerID: '',
//         orderID: order?order.id :'',
//         paymentID: ''
//       }
//     }
    
//   });
//   try {
//     const newProduct = await newOrder.save();
//     console.log("save");
//     if (newProduct) {
//       return res
//         .status(201)
//         .send({ message: 'New order placed', data: newProduct });
//     }
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send(error.message);
//   }


// });



// router.post('/shipping', isAuth, async (req, res) => {

//   console.log(req.user._id);
//   const newshipping = new Shipping({
//     addressType: req.body.addressType,
//     phone: req.body.phone,
//     user: req.user._id,
//     address: req.body.address,
//     receiver: req.body.receiver,
//     city: req.body.city,
//     state: req.body.state,
//     zipcode: req.body.zipcode,
//     fullAddress: `${req.body.address}, ${req.body.city}, ${req.body.state}, ${req.body.country}, ${req.body.zipcode}`,
//     country: req.body.country,
//     isDefault: req.body.isDefault,
//   });
//   try {
//     const newAddress = await newshipping.save();
//     if (newAddress) {

//       return res
//         .status(201)
//         .send({ message: 'New Address Added', data: newAddress });
//     }
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send(error.message);
//   }


// });


// router.delete('/:id', isAuth, async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     const deleteOrder = await order.remove();
//     res.send({ message: 'Order Deleted', order: deleteOrder });
//   } else {
//     res.status(404).send({ message: 'Order Not Found' });
//   }
// });


// router.put(
//   '/:id/deliver',
//   isAuth,
//   isAdmin, async (req, res) => {
//     const order = await Order.findById(req.params.id);
//     if (order) {
//       order.isDelivered = true;
//       order.deliveredAt = Date.now();

//       const updatedOrder = await order.save();
//       res.send({ message: 'Order Delivered', order: updatedOrder });
//     } else {
//       res.status(404).send({ message: 'Order Not Found' });
//     }
//   }
// );

// export default router;
