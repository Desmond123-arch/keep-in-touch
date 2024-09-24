import { text } from "express";
import mongoose from "mongoose"
const schema = mongoose.Schema;


const messageSchema = new schema({
    'message': {
        type: String
    },
    'sender': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversations',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        default: text,
    },
    fileName: {
        type: String,
        default: ''
    },
    mimeType: {
        type: String,
        default: ''
    },
});

export default mongoose.model('Messages', messageSchema);