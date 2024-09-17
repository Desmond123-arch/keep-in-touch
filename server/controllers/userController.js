import mongoose from "mongoose";
import dbClient from "../utils/db.js";
import crypto from 'crypto';
import { generateToken, verifyToken } from "../utils/jwtHelpers.js";

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
        password: hashPassword(req.body.password),
    };
    try {
        // Find user by email
        const user = await dbClient.User.findOne({ email: req.body.email }).select('+password');
        if (user.password === loginDetail.password) {
            const token = generateToken(user);
            res.status(200).send({ user, token});
        } else {
            res.status(404).send({ error: "User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Login failed" });
    }
};

const chatParticipants = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);
        // Correct the $in syntax, userId should be in an array
        const conversations = await dbClient.Conversation.find({
            participants: { $in: [userId] }, // userId inside an array
        }).populate('participants', 'firstName lastName');
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

const searchUsers = async (req, res) => {
    const searchTerm = req.query.q; 
    console.log('search was called')
    
    try {
        const users = await dbClient.User.find({
            $or: [
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        }).select('firstName lastName email');

        if (users.length === 0) {
            return res.status(404).send({ message: 'No users found' });
        }

        res.status(200).send(users);
    } catch (error) {
        console.log('Error searching users:', error);
        res.status(500).send({ error: 'Failed to search users' });
    }
};
const UserDetails = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Convert userId to ObjectId
        const objectId = new mongoose.Types.ObjectId(userId);

        // Find user by _id
        const user = await dbClient.User.findById(objectId);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'An error occurred' });
    }
};



export default { addUser, loginUser, chatParticipants, searchUsers, UserDetails};