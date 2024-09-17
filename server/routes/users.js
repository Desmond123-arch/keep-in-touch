import express from 'express'
import userController from '../controllers/userController.js';

const Usersrouter = express.Router();

Usersrouter.post('/auth/create', userController.addUser);
Usersrouter.post('/auth/login', userController.loginUser);
Usersrouter.get('/my_chats/:userId', userController.chatParticipants);

export default Usersrouter;