import mongoose, { Schema } from "mongoose";

const prodSchema = new Schema({
    prod_id: {type: String, require: true},
    quantity: {type: Number, required: true}
}, {_id: false});

const cartSchema = new Schema({
    product: [{ type: prodSchema, default: [] }], // Cambio aquí, product ahora es un array
    status: { type: String, default: 'pending', enum: ['discarded', 'pending', 'in_progress', 'sent', 'finished'] }
}, { timestamps: true});

export default mongoose.model('cart', cartSchema);