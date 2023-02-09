import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    clientName:{ type: String, required:true},
    clientId:{ type: String, required:true ,unique: true},
    gst:{ type: String, required:true},
    address:{ type: String,},
    phoneNumber: { type: String,},
    CreatedAt: { type: Date },
    UpdatedAt: { type: Date },
});

const clientModel = mongoose.model("Client",clientSchema);

export default clientModel;