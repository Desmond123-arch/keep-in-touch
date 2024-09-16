import mongoose from "mongoose";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import ConversationModel from "../models/ConversationModel.js";


class DBClient {
    constructor() {
        const port = 27017;
        const host = 'localhost';
        this.url = `mongodb://${host}:${port}/chat-app-test`
        this.messageModel = null;
    }
    async connect() {
        try {
            console.log('connecting to database');
            await mongoose.connect(this.url);
            const schema = mongoose.Schema;
            // model creation
            this.User = userModel
            this.Message = messageModel
            this.Conversation = ConversationModel
            
        }
        catch (err) {
            console.log(err);
        }
    }

}
let dbClient = new DBClient();
await dbClient.connect();
export default dbClient;
