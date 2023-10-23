import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: 
     { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  priceSale: { type: Number, default: 0, required: true },
  description: { type: String, required: true },
  createdAt: {  type: Date },
});


const productModel = mongoose.model("Product", productSchema);

export default productModel;