import mongoose from 'mongoose';

const ItemsSchema = {
    total :  { type: String, required: true },
    challanDate : { type: Date, required: true },
    challanNo: { type: String, required: true },
    designId: { type: String, required: true },
    designName: { type: String, required: true },
    plain: { type: String, required: true },
    quantity: { type: String, required: true ,default: ''},
    price: { type: String, required: true ,default: ''},
    short: { type: String, required: true ,default: ''},
};

const Invoice = new mongoose.Schema({
    invoiceNo: { type: String, required:true},
    invoiceDate: { type: Date,required:true},
    status: { type: String, required:true},
    discount: { type: Boolean, default: false},
    dueDate: { type: Date,required:true},
    TotalAmount: { type: Number, required:true},
    invoiceAmount: { type: Number, required:true},
    CreatedAt: { type: Date,required:true},
    UpdatedAt: { type: Date,required:true},
    invoiceTo: { type: mongoose.Schema.Types.ObjectID, ref: 'Client' },
    items: [ItemsSchema],
});


const invoiceModel = mongoose.model("Invoice",Invoice);

export default invoiceModel;