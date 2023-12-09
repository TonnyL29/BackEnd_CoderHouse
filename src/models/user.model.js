import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {type: String, required: true},
    name: {type: String, required: true},
    lastname: {type: String},
    password: {type: String},
    email: {type: String, unique: true},
    status: { type: String, default: 'user', enum: ['user', 'Admin', 'block'] },
    provider: String
}, { timestamps: true, _id: true});


export default mongoose.model('user', userSchema);