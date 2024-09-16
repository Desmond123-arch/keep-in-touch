import mongoose from "mongoose";

const schema = mongoose.Schema;

const conversationSchema = new schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages'
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Conversations', conversationSchema);