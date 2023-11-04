import mongoose from "mongoose";

const productSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, requiere: false },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String },
    thumbnail: { type: String }
}, {timestamps: true });


export default mongoose.model('product', productSchema);