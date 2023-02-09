import express from 'express';
import News from '../models/newsModel';
import User from '../models/userModel';
import http from 'http';

import bodyParser from 'body-parser';
import { isAdmin, isAuth, isSellerOrAdmin } from '../util.js';

const router = express.Router();

var options = {
  host: 'inshorts-api.herokuapp.com',
  path: '/news?category='
}
// router.get("/", (reqp, resp, next) =>{
//   var news  = ''; 
//   //console.log(reqp)

// var request = http.request(options, function (res) {
//   var data = '';
//   res.on('data', function (chunk) {
//       data += chunk;
//   });
//    res.on('end', function () {
      
//       console.log(data.length);
//       resp.send(data);
// //        console.log(data);

//   });
// });
// request.on('error', function (e) {
//   console.log("error"+e.message);
// });
//   request.end();
  
// });

router.get('/', async (req, res) => {
  const language = req.query.lang!=undefined? req.query.lang:'' || '';;
  console.log(req.query.lang + language)
  // const pageSize = 6;
  // const page = Number(req.query.pageNumber) || 1;
  // const searchKeyword = req.query.searchKeyword || '';;
 
  // const category = req.query.category || '';
  // const order = req.query.order || '';
  // const min =
  //   req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  // const max =
  //   req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  // const rating =
  //   req.query.rating && Number(req.query.rating) !== 0
  //     ? Number(req.query.rating)
  //     : 0;

  // const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  // const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  // const sortOrder = order === 'lowest' ? { price: 1 }: order === 'highest' ? { price: -1 }: order === 'toprated'? { rating: -1 } : { _id: -1 };
  // const nameFilter = searchKeyword ? { name: { $regex: searchKeyword, $options: 'i' } } : {};
  // const seller = req.query.seller || '';
  // const sellerFilter = seller ? { seller } : {};
  // const categoryFilter = category ? { category } : {};
  // const count = await Product.countDocuments({
  //   ...sellerFilter,
  //   ...nameFilter,
  //   ...categoryFilter,
  //   ...priceFilter,
  //   ...ratingFilter,
  // });
  // const products = await Product.find({...sellerFilter,
  //   ...nameFilter,...categoryFilter,...priceFilter,
  //   ...ratingFilter,
  // }).populate('seller', 'seller.name seller.logo').sort(sortOrder).skip(pageSize * (page - 1))
  // .limit(pageSize);
  const languageFilter = language ? { language } : {};

  const news = await News.find({...languageFilter }).populate('author' , { firstName: 1, lastName: 1 });

  res.send(news);
});

router.get('/categories',async (req, res) => {
   
    
    const categories = await Product.find().distinct('category');
    res.send(categories);
  }
);

 router.get('/:id', async (req, res) => {
  const product = await News.findOne({ _id: req.params.id })
  
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found.' });
  }
});
router.put('/:id',isAuth, async (req, res) => {
  const newsId = req.params.id;
  const news = await News.findById(newsId);
  const all = await News.find();

  console.log("noo:-"+ all);
  if (newsId) {
    news.author = req.user._id,
    news.title = req.body.title;
    news.content = req.body.content;
    news.image = req.body.image;
    news.tag = req.body.tag;
    news.category = req.body.category;
    news.source = req.body.source;
    news.sourceurl = req.body.sourceurl;
    news.language = req.body.language;
    news.UpdatedAt  = Date.now()
    const updatedNews = await news.save();
    if (updatedNews) {
      return res
        .status(200)
        .send({ message: 'Product Updated', data: updatedNews });
    }
  }
  return res.status(500).send({ message: ' Error in Updating Product.' });
});

router.delete('/:id',isAuth, isAdmin,async (req, res) => {
  const deletedProduct = await News.findById(req.params.id);
  if (deletedProduct) {
    await deletedProduct.remove();
    res.send({ message: 'Product Deleted' });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

//router.post('/',isAuth, isAdmin, async (req, res) => {
  
//   const product = new Product({
//     name: req.body.name,
//     price: req.body.price,
//     image: req.body.image,
//     brand: req.body.brand,
//     category: req.body.category,
//     countInStock: req.body.countInStock,
//     description: req.body.description,
//     rating: req.body.rating,
//     numReviews: req.body.numReviews,
//   });
//   const newProduct = await product.save();
//   if (newProduct) {
//     return res
//       .status(201)
//       .send({ message: 'New Product Created', data: newProduct });
//   }
//   return res.status(500).send({ message: ' Error in Creating Product.' });
// });

router.post(
  '/',
  isAuth,async (req, res) => {
    const news = new News({
      title: 'Have a couple more kids and enjoy love, David Warner jokingly advises Virat Kohli',
    category:'Sports',
    content:`On being asked what advice he'd give to Virat Kohli over his poor form in initial matches of IPL 2022, DC opener David Warner jokingly said, "Have a couple more kids and enjoy love." He added, "Form is temporary and class is permanent. So you don't lose that. [Bad form] happens to every single player in the world."`,
    image: 'https://static.inshorts.com/inshorts/images/v1/variants/jpg/m/2022/05_may/4_wed/img_1651682734623_23_3.jpg',
    tag:'cricket',
    sourceurl:'https://www.hindustantimes.com/cricket/david-warner-comes-up-with-classic-one-liner-on-virat-kohli-s-lean-patch-101651669798054-amp.html',
    source: 'sports',
    CreatedAt:  Date.now(),
    UpdatedAt:  Date.now(),
    language:'English',
    author: req.user._id,
    });
    
    const createdNews = await news.save();
    res.send({ message: 'News Created', allnews: createdNews });
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

// router.get('/seed',async (req, res) => {
//     // await Product.remove({});
//     const createdProducts = await Product.insertMany(data.products);
//     res.send({ createdProducts });
//     const seller = await User.findOne({ isSeller: true });
//     if (seller) {
//       const products = data.products.map((product) => ({
//         ...product,
//         seller: seller._id,
//       }));
//       const createdProducts = await Product.insertMany(products);
//       res.send({ createdProducts });
//     } else {
//       res
//         .status(500)
//         .send({ message: 'No seller found. first run /api/users/seed' });
//     }
//   }
// );

export default router;
