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
    }
});

export default mongoose.model('Messages', messageSchema);