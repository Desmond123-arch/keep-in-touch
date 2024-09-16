import mongoose from 'mongoose';
import dbClient from '../utils/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';


const httpServer = createServer();
const io = new Server(httpServer, {
    cors:
    {
        origin: '*',
    }
})

io.on('connection', (socket) => {

    socket.on('sendMessage', async (messageDetails) => {
        try {
            //create a new conversation
            const sender = new mongoose.Types.ObjectId(messageDetails.sender);
            const receiver = new mongoose.Types.ObjectId(messageDetails.receiver);


            let conversation = await dbClient.Conversation.findOne({
                participants: { $all: [sender, receiver] }
            }).populate('messages');

            //no conversations yet
            if (!conversation) {
                const newConversation = new dbClient.Conversation({
                    participants: [sender, receiver],
                });
            }
            conversation = await newConversation.save();

            
        }
        catch(err)
        {
            console.log('err');
        }
    })
})