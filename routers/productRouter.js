import express from 'express';
import Product from '../models/productModel';


import { isAdmin, isAuth, isSellerOrAdmin } from '../util.js';
import data from '../data';

const router = express.Router();

router.get('/seed',async (req, res) => {
  // await Product.remove({});
  try {
    const createdProducts = await Product.insertMany(data.products);
  console.log(createdProducts);
  if (createdProducts) {
  res
      .status(500)
      .send({ message: {createdProducts }});
  }
  else{
    res
      .status(500)
      .send({ message: 'No seller found. first run /api/users/seed' });
  }
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send({ message: {error}});
  }
//  const createdProducts = await Product.insertMany(data.products);
 // res.send({ createdProducts });
  // const seller = await User.findOne({ isSeller: true });
  // if (seller) {
  //   const products = data.products.map((product) => ({
  //     ...product,
  //     seller: seller._id,
  //   }));
  //   const createdProducts = await Product.insertMany(products);
  //   res.send({ createdProducts });
  // } 
  // else {
    res
      .status(500)
      .send({ message: 'No seller found. first run /api/users/seed' });
  //}
}
);

router.get('/', async (req, res) => {
  
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;
  const products = await Product.find();
  
  res.send( products );
}
);
// router.get('/', async (req, res) => {
  
//   const pageSize = 6;
//   const page = Number(req.query.pageNumber) || 1;
//   const searchKeyword = req.query.searchKeyword || '';;
 
//   const category = req.query.category || '';
//   const order = req.query.order || '';
//   const min =
//     req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
//   const max =
//     req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
//   const rating =
//     req.query.rating && Number(req.query.rating) !== 0
//       ? Number(req.query.rating)
//       : 0;

//   const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
//   const ratingFilter = rating ? { rating: { $gte: rating } } : {};
//   const sortOrder = order === 'lowest' ? { price: 1 }: order === 'highest' ? { price: -1 }: order === 'toprated'? { rating: -1 } : { _id: -1 };
//   const nameFilter = searchKeyword ? { name: { $regex: searchKeyword, $options: 'i' } } : {};
//   const seller = req.query.seller || '';
//   const sellerFilter = seller ? { seller } : {};
//   const categoryFilter = category ? { category } : {};
//   const count = await Product.countDocuments({
//     ...sellerFilter,
//     ...nameFilter,
//     ...categoryFilter,
//     ...priceFilter,
//     ...ratingFilter,
//   });
//   const products = await Product.find({...sellerFilter,
//     ...nameFilter,...categoryFilter,...priceFilter,
//     ...ratingFilter,
//   }).populate('seller', 'seller.name seller.logo').sort(sortOrder).skip(pageSize * (page - 1))
//   .limit(pageSize);
//   //const products = await Product.find(nameFilter).sort(order);

//   res.send({ products, page, pages: Math.ceil(count / pageSize) });
// });

// router.get('/categories',async (req, res) => {
   
    
  //     const categories = await Product.find().distinct('category');
  //     res.send(categories);
//   }
// );
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
 router.get('/det/:code', async (req, res) => {
   console.log(req.params.id)
    //  const nameFilter = req.params.id ? { name: { $regex: req.params.id.split("")[0], $options: 'i' } } : {};

   try {
    const product = await Product.find({ code: { $regex:req.params.code.split("-").join(""), $options: 'i' } }  )
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
router.put('/:id',isAuth, async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  
  if (product) {
     
     product.name = req.body.name;
     product.price = req.body.price;
     product.priceSale = req.body.priceSale;
     product.sku = req.body.sku;
     product.cover = req.body.images[0];
     product.images = req.body.images;
     product.code = req.body.code;
     product.tag = req.body.tag;
     product.status = req.body.status;
     product.inventoryType= req.body.inventoryType;     
     product.description = req.body.description;
     product.gender = req.body.gender;
     product.category = req.body.category;
     product.colors = req.body.colors;
     product.available = req.body.available;
     const updatedProduct = await product.save(); 
    if (product) {
      return res
        .status(200)
        .send({ message: 'Product Updated', data: product });
    }
  }
  return res.status(500).send({ message: ' Error in Updating Product.' });
});

router.delete('/:id',isAuth,async (req, res) => {
  const deletedProduct = await Product.findById(req.params.id);
  if (deletedProduct) {
    await deletedProduct.remove();
    res.send({ message: 'Product Deleted' });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// // router.post('/',isAuth, isAdmin, async (req, res) => {
  
// //   const product = new Product({
// //     name: req.body.name,
// //     price: req.body.price,
// //     image: req.body.image,
// //     brand: req.body.brand,
// //     category: req.body.category,
// //     countInStock: req.body.countInStock,
// //     description: req.body.description,
// //     rating: req.body.rating,
// //     numReviews: req.body.numReviews,
// //   });
// //   const newProduct = await product.save();
// //   if (newProduct) {
// //     return res
// //       .status(201)
// //       .send({ message: 'New Product Created', data: newProduct });
// //   }
// //   return res.status(500).send({ message: ' Error in Creating Product.' });
// // });

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

// router.post('/:id/reviews', isAuth,async (req, res) => {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     if (product) {
//       if (product.reviews.find((x) => x.name === req.user.name)) {
//         return res
//           .status(400)
//           .send({ message: 'You already submitted a review' });
//       }
//       const review = {
//         name: req.user.name,
//         rating: Number(req.body.rating),
//         comment: req.body.comment,
//       };
//       product.reviews.push(review);
//       product.numReviews = product.reviews.length;
//       product.rating =
//         product.reviews.reduce((a, c) => c.rating + a, 0) /
//         product.reviews.length;
//       const updatedProduct = await product.save();
//       res.status(201).send({
//         message: 'Review Created',
//         review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
//       });
//     } else {
//       res.status(404).send({ message: 'Product Not Found' });
//     }
//   }
// );


export default router;
