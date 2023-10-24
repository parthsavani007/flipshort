import express from 'express';
import Product from '../models/productModel';


import data from '../data';

const router = express.Router();


router.get('/test', async (req, res) => {
  
  
  res.send( "test" );
}
);

router.get('/get', async (req, res) => {
  
  const products = await Product.find();
  
  res.send( products );
}
);

router.get('/:id', async (req, res) => {
  console.log(req.params.id)
  const productId = req.params.id;
  try {
   const product = await Product.findById(productId)
   console.log(product.length);
   if (product) {
     res.send(product);
   } else {
     res.status(404).send({ message: 'Product Not Found.' });
   }
   
  } catch (error) {
   res.status(404).send({ message: error });
  }
 
 
});
 

router.post(
  '/',async (req, res) => {
    const product = new Product({
          name: req.body.name,
          price: req.body.price,
          image: req.body.image,
          priceSale: req.body.priceSale,
          description: req.body.description,
         });
        const newProduct = await product.save();
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  }
);



export default router;
