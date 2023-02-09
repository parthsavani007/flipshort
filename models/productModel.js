import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    helpful: { type: Number, required: true },
    postedAt: { type: Date },
    isPurchased: { type: Boolean, default: false },
  }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cover: { type: String, required: true },
  images: {
    type: [ { type: String, required: true }],
    default: undefined  
  },
  code: { type: String, required: true },
  sku: { type: String, required: true },
  tag: {
    type: [ { type: String, required: true }],
    default: undefined
  
  }, 
  price: { type: Number, default: 0, required: true },
  priceSale: { type: Number, default: 0, required: true },
  totalRating: { type: Number, default: 0, required: true  },
  totalReview: { type: Number, default: 0, required: true  },
  reviews: [reviewSchema],
  status: { type: String, },
  inventoryType: { type: String, },
  sizes: {
    type: [ { type: String, required: true }],
    default: undefined
  
  },
  available: { type: Number, default: 0, required: true },
  description: { type: String, required: true },
  sold: { type: Number, default: 0, required: true },
  createdAt: {  type: Date },
  category: { type: String, required: true },
  gender: { type: String, required: true },
  colors: {
    type: [ { type: String, required: true }],
    default: undefined
  },
 // seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
  
});
// const productSchema = new mongoose.Schema({
//   "cover": {
//     "type": "String"
//   },
//   "images": {
//     "type": [
//       "String"
//     ]
//   },
//   "name": {
//     "type": "String"
//   },
//   "code": {
//     "type": "String"
//   },
//   "sku": {
//     "type": "String"
//   },
//   "tags": {
//     "type": [
//       "String"
//     ]
//   },
//   "price": {
//     "type": "Number"
//   },
//   "priceSale": {
//     "type": "Number"
//   },
//   "totalRating": {
//     "type": "Number"
//   },
//   "totalReview": {
//     "type": "Number"
//   },
//   "reviews": {
//     "type": [
//       "Mixed"
//     ]
//   },
//   "status": {
//     "type": "String"
//   },
//   "inventoryType": {
//     "type": "String"
//   },
//   "sizes": {
//     "type": [
//       "String"
//     ]
//   },
//   "available": {
//     "type": "Number"
//   },
//   "description": {
//     "type": "String"
//   },
//   "sold": {
//     "type": "Number"
//   },
//   "createdAt": {
//     "type": "Date"
//   },
//   "category": {
//     "type": "String"
//   },
//   "gender": {
//     "type": "String"
//   },
//   "colors": {
//     "type": [
//       "String"
//     ]
//   }
// });

const productModel = mongoose.model("Product", productSchema);

export default productModel;