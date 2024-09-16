import express from 'express';
import chatRouter from './routes/chatRoutes.js';
import Usersrouter from './routes/users.js';


const app = express();
const port = 3000;


app.use(express.json());
app.use('/chat', chatRouter);
app.use('/auth', Usersrouter)



app.listen(port, () => {
    console.log("running");
})