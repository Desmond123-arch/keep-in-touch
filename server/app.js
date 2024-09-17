import express from 'express';
import chatRouter from './routes/chatRoutes.js';
import Usersrouter from './routes/users.js';
import cors from 'cors'

const app = express();
const port = 3000;
app.use(cors());

app.use(express.json());
app.use('/chat', chatRouter);
app.use('/users', Usersrouter)


export default app;

