import { mongoose } from 'mongoose';
import dbClient from './utils/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';

// Create an HTTP server and initialize socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', async (socket) => {

    const userId = socket.handshake.query.userId;

    await dbClient.User.findByIdAndUpdate(userId, {
        $set: { SocketId: socket.id },
    });

    const user =  await dbClient.User.findById(userId)

    socket.on('sendMessage', async (messageDetails) => {
        try {
            const sender = new mongoose.Types.ObjectId(messageDetails.sender);
            const receiver = new mongoose.Types.ObjectId(messageDetails.receiver);

            let conversation = await dbClient.Conversation.findOne({
                participants: { $all: [sender, receiver] },
            }).populate('messages');


            // If no conversation exists, create one
            if (!conversation) {
                const newConversation = new dbClient.Conversation({
                    participants: [sender, receiver],
                });
                conversation = await newConversation.save();
            }
            // console.log(messageDetails);
            // User joins the conversation room
            socket.join(conversation._id.toString());

            // Create and save the new message
            messageDetails.conversationId = conversation._id;
            const newMessage = new dbClient.Message(messageDetails);
            await newMessage.save();

            // Update the conversation with the new message
            await dbClient.Conversation.findByIdAndUpdate(conversation._id, {
                $push: { messages: newMessage._id },
                lastUpdated: new Date(),
            });

            // Emit the new message to all users in the conversation
            io.to(conversation._id.toString()).emit('receiveMessage', newMessage);

        } catch (error) {
            // console.log('Error sending message:', error);
            socket.emit('error', { error: 'Failed to send message' });
        }
    });
    socket.on('logout', async () => {
        await dbClient.User.findByIdAndUpdate(userId, {
            $set: { SocketId: '' },
        });
    })
    socket.on('disconnect', async () => {
        // console.log('User disconnected:', socket.id);
        await dbClient.User.findByIdAndUpdate(userId, {
            $set: { SocketId: '' },
        });
    });
});

// Start the HTTP server
httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});
