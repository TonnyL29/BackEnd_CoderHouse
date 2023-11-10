import mongoose, { Schema } from "mongoose";

const userDateSchema = new Schema({
    name: {type: string, required: true},
    lastname: {type: string, required: true},
    birthdate: { type: Date, required: true },
    registrationDate: { type: Date, default: Date.now }
}, { _id: false });

const streetSchema = new Schema({
    streetName: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
}, { _id: false });

const userSchema = new Schema({
    user_id: { type: String, required: true, unique: true },
    fullname: {type: { userDateSchema }, required: true},
    street: {type: { streetSchema }},
    email: {type: string, required: true, unique: true},
    status: { type: String, default: 'active', enum: ['active', 'review', 'block', 'low'] }
}, { timestamps: true, _id: false});


export default mongoose.model('cart', userSchema);