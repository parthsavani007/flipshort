import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

import config from './config';
const mongoose = require("mongoose");

import productRouter from './routers/productRouter'
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


 const app = express();
 app.use(cors());

app.use(function (req, res, next) {
    //  console.log(req.originalUrl);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Origin', 'http://localhost:3030');
    res.header("Access-Control-Allow-Origin", "https://flipshort.vercel.app");
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
  
  app.use('/api/product', productRouter);
  
 
app.listen(5500,()=>{
  
    console.log("server started http://localhost:5500")
  
  });
  
