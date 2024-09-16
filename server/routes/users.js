import express from 'express'
import userController from '../controllers/userController.js';

const Usersrouter = express.Router();

Usersrouter.post('/create', userController.addUser);
Usersrouter.post('/login', userController.loginUser);

export default Usersrouter;