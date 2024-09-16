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
            res.status(201).send({status: "success"});
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

const loginUser = async (req, res)=> {
    const loginDetail = {
        email: req.body.email,
        password: req.body.password,
    }
    console.log(loginDetail)
    try {
        const user = await dbClient.User.find({'email': req.body.email});
        console.log(user);
        if (user.length === 1)
        {
            const usersMessages = await dbClient.Message.find({sender: req.body.email});
            console.log(user);
            console.log(usersMessages);
            res.status(200);
        }
    }
    catch (err)
    {
        console.log(err);
    }
}
export default { addUser, loginUser };