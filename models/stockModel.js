import mongoose from 'mongoose';


const Stock = new mongoose.Schema({
    challanNo: { type: String, required:true},
    challanDate: { type: Date,required:true},
    stockQuantity: { type: String, required:true},
    Short: { type: String, required:true},
    Remark: { type: String, required:true},
    clientName:{type: String, required:true},
    clientId:{type: String, required:true},
    designName: { type: String, required:true},
    designId: { type: String, required:true},
    CreatedAt: { type: Date,required:true},
    UpdatedAt: { type: Date,required:true},
    client: { type: mongoose.Schema.Types.ObjectID, ref: 'Client' },
    design: { type: mongoose.Schema.Types.ObjectID, ref: 'Design' },
});

const stockModel = mongoose.model("Stock",Stock);

export default stockModel;