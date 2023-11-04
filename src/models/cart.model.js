import mongoose from "mongoose";

const cartSchema = new Schema({
    id: { type: String, required: true, unique: true },
    product_id: { type: {}, default: {} },
    user_id: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['discarded', 'pending', 'in_progress', 'sent', 'finished'] }
}, { timestamps: true });


export default mongoose.model('cart', cartSchema);