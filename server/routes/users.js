import express from 'express'
import userController from '../controllers/userController.js';
import authenticateToken from '../middleware/auth.js';

const Usersrouter = express.Router();

Usersrouter.post('/auth/create', userController.addUser);
Usersrouter.post('/auth/login', userController.loginUser);
Usersrouter.get('/search', userController.searchUsers);
Usersrouter.get('/:userId', authenticateToken, userController.UserDetails);
Usersrouter.get('/my_chats/:userId',authenticateToken ,userController.chatParticipants);
export default Usersrouter;