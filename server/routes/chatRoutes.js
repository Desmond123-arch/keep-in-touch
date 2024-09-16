import chatController from '../controllers/chatController.js';
import express from 'express'

const chatRouter = express.Router();

chatRouter.post('', chatController.sendMessage);
chatRouter.get('/conversation/:user1/:user2', chatController.getConversation);


export default chatRouter;