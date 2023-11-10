import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    msn_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    message: {type: String}
}, { timestamps: true , _id: false});


export default mongoose.model('message', messageSchema);