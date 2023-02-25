import mongoose from 'mongoose';

const ItemsSchema = {
    amount :  { type: String, required: true },
    challanDate : { type: Date, required: true },
    challanNo: { type: String, required: true },
    designId: { type: String, required: true },
    plain: { type: String, required: true },
    quantity: { type: String, required: true ,default: ''},
    rate: { type: String, required: true ,default: ''},
    short: { type: String, required: true ,default: ''},

};

const Invoice = new mongoose.Schema({
    invoiceNo: { type: String, required:true},
    invoiceDate: { type: Date,required:true},
    invoiceStatus: { type: String, required:true},
    invoiceDiscount: { type: String, required:true},
    gst: { type: String, required:true},
    TotalAmount: { type: String, required:true},
    taxamount: { type: String, required:true},
    invoiceAmount: { type: String, required:true},
    CreatedAt: { type: Date,required:true},
    UpdatedAt: { type: Date,required:true},
    clientName: { type: mongoose.Schema.Types.ObjectID, ref: 'Client' },
    Items: [ItemsSchema],
});


const invoiceModel = mongoose.model("Invoice",Invoice);

export default invoiceModel;