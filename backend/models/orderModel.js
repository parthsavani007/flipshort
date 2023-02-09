import mongoose from 'mongoose';
var uuid = require('node-uuid');

const shippingSchema = new mongoose.Schema({
    receiver :  { type: String, required: true },
    phone : { type: Number, required: true },
    fullAddress: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true ,default: ''},
    zipcode: { type: String, required: true },
    addressType:{ type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const paymentSchema = {
    paymentMethod: { type: String, required: true },
    paymentResult:{
    payerID:{ type: String},
    orderID:{ type: String},
    paymentID:{ type: String }
}
};

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    cover: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    price: { type: Number, default: 0, required: true },
    subtotal: { type: Number, default: 0, required: true },
});
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderid:{type: String, default: uuid.v4},
    //seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    orderItems: [orderItemSchema],
    shipping: shippingSchema,
    payment: paymentSchema,
    subtotal: { type: Number },
    shippingPrice: { type: Number },
    discount: { type: Number },
    total: { type: Number },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
}, {
    timestamps: true
});


const orderModel = mongoose.model("Order", orderSchema);
const shippingModel = mongoose.model("Shipping", shippingSchema);
export {orderModel,shippingModel};