import mongoose from 'mongoose';
import dbClient from '../utils/db.js';


const sendMessage = async (req, res) => { 
    try {
        // create a new conversation if none exists
        const sender = new mongoose.Types.ObjectId(req.body.sender);
        const receiver = new mongoose.Types.ObjectId(req.body.receiver);

        let conversation = await dbClient.Conversation.findOne({
            participants: { $all: [sender, receiver] }
        }).populate('messages');

        // if no conversation yet, create one
        if (!conversation) {
            const newConversation = new dbClient.Conversation({
                participants: [sender, receiver],

            });
            conversation = await newConversation.save();
        }
        messageDetails.conversationId = conversation._id;
        const newMessage = new dbClient.Message(messageDetails);
        await newMessage.save();

        // Update the conversation with the new message
        await dbClient.Conversation.findByIdAndUpdate(
            conversation._id,
            { $push: { messages: newMessage._id }, lastUpdated: new Date() }
        );

        res.status(201).send(newMessage);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to send message' });
    }
};

const getConversation = async (req, res) => {
    const { user1, user2 } = req.params;

    try {
        const user1Id = new mongoose.Types.ObjectId(user1);
        const user2Id = new mongoose.Types.ObjectId(user2);


        const conversation = await dbClient.Conversation.findOne({
            participants: { $all: [user1Id, user2Id] }
        }).populate('messages');

        console.log(conversation);
        if (!conversation) {
            const newConversation = new dbClient.Conversation({
                participants: [user1Id, user2Id],
            });
            await newConversation.save();
            res.status(200).send(newConversation);
        } else {
            res.status(200).send(conversation);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Failed to get conversation' });
    }
};
const startConversation = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        const sender = new mongoose.Types.ObjectId(senderId);
        const receiver = new mongoose.Types.ObjectId(receiverId);

        let conversation = await dbClient.Conversation.findOne({
            participants: { $all: [sender, receiver] }
        });

        if (!conversation) {
            const newConversation = new dbClient.Conversation({
                participants: [sender, receiver],
            });
            conversation = await newConversation.save();
        }

        res.status(201).send(conversation);
    } catch (error) {
        console.log('Error starting conversation:', error);
        res.status(500).send({ error: 'Failed to start conversation' });
    }
};

export default { sendMessage, getConversation, startConversation };
