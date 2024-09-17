import mongoose from "mongoose";
import dbClient from "../utils/db.js";
import crypto from 'crypto';

const sha1 = crypto.createHash('sha1');

function hashPassword(password) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(password);
    return sha1.digest('hex');
}


const addUser = async (req, res) => {
    const userDetails = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword(req.body.password),
    }
    try {
        const temp = await dbClient.User.find({ email: req.body.email });
        console.log(temp);
        if (temp.length === 0) {
            const newUser = new dbClient.User(userDetails);
            await newUser.save();
            res.status(201).send({ status: "success" });
        }
        else {
            res.status(409).send({ error: 'User already exists' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to create user' })
    }
}

const loginUser = async (req, res) => {
    const loginDetail = {
        email: req.body.email,
        password: req.body.password,
    }
    console.log(loginDetail)
    try {
        const user = await dbClient.User.find({ 'email': req.body.email });
        console.log(user);
        if (user.length === 1) {
            const usersMessages = await dbClient.Message.find({ sender: req.body.email });
            console.log(user);
            console.log(usersMessages);
            res.status(200);
        }
    }
    catch (err) {
        console.log(err);
    }
}
const chatParticipants = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);

        console.log(userId);
        // Correct the $in syntax, userId should be in an array
        const conversations = await dbClient.Conversation.find({
            participants: { $in: [userId] }, // userId inside an array
        }).populate('participants', 'firstName lastName');

        console.log(conversations);
        // Extract chat partners, excluding the current user
        const chatPartners = conversations.flatMap((convo) =>
            convo.participants.filter((participant) => !participant._id.equals(userId))
        );

        res.status(200).send(chatPartners);
    } catch (err) {
        console.log('Error fetching chat participants:', err);
        res.status(500).send({ error: 'Failed to fetch chat participants' });
    }
};



export default { addUser, loginUser, chatParticipants};