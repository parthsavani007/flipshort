import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

const Razorpay = require("razorpay");
import config from './config';
const mongoose = require("mongoose");
import clientRouter from './routers/clientRouter'
import designRouter from './routers/designRouter'
import stockRouter from './routers/stockRouter'
import invoiceRouter from './routers/invoiceRouter'
const cors = require('cors');

import bodyParser from 'body-parser';

const mongodbUrl = config.MONGODB_URL;

const client = mongoose.connect(mongodbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
.then( () => {
    console.log('Connected to database ');
   //loadData();
   // var products = Product.find({});
  //  console.log(products);
})
.catch( (err) => {
    console.error(`Error connecting to the database. \n${err}`);
 });

const razorpay = new Razorpay({
  key_id: config.R_KeyId,
  key_secret: config.RAZOR_PAY_KEY_SECRET,
});
 const app = express();
 app.use(cors());

app.use(function (req, res, next) {
  
    //  console.log(req.originalUrl);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Origin', 'http://localhost:3030');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE", "OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-client-key, x-client-token, x-client-secret");
    next();
  });
  app.use(bodyParser.json());
  app.get("/", (req, res) => {
    res.send("Welcome to a basic express App");
  });
    // app.use('/api/products', productRouter);
  app.use('/api/users', clientRouter);
  app.use('/api/design', designRouter);
  app.use('/api/stock', stockRouter);
  app.use('/api/invoice', invoiceRouter);

  // app.use('/api/orders', orderRouter);
  // app.use('/api/uploads', uploadRouter);
 
app.listen(5000,()=>{
  
    console.log("server started http://localhost:5000")
  
  });