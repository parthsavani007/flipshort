import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
    designName:{ type: String, required:true},
    designId:{ type: String, required:true},
    designRate:{ type: String, required:true},
    CreatedAt: { type: Date },
    UpdatedAt: { type: Date },
    client: { type: mongoose.Schema.Types.ObjectID, ref: 'Client' },
});

const designModel = mongoose.model("Design",designSchema);

export default designModel;