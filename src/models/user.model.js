import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {type: String, required: true},
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    status: { type: String, default: 'user', enum: ['user', 'Admin', 'block'] }
}, { timestamps: true, _id: true});


export default mongoose.model('user', userSchema);