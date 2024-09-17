# Backend ReadMe

## Project Overview
This is the backend for a chat application, built using **Node.js**, **Express**, and **MongoDB**. The backend handles user authentication, conversation management, and real-time messaging between users via **Socket.IO**. The data is stored using **Mongoose** models, and the API exposes various routes for user management, message handling, and retrieving conversations.

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v14.x or above)
- **MongoDB** (local or cloud instance)
- **npm** (v6.x or above)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/chat-backend.git
   cd chat-backend
2. Install dependencies:
    ```
    npm install
    ```
3. Start server
    ```
    node socket.io
    ```
    ## API Routes
       # User Routes
        
        Create a New User
        URL: /users/auth/create
        Method: POST
        Body
        ```
        {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "password": "password123"
        }

        ```
        Response:
            201: User created successfully.
            409: User already exists.

        User Login
        URL: /users/auth/login
        Method: POST
        Body
        ```
        {
        "email": "john.doe@example.com",
        "password": "password123"
        }
        ```
        Response:
            200: Successful login, returns a JWT token.
            404: User not found or invalid credentials.

    # Chat Routes
        Send a Message
        URL: /chat
        Method: POST
        Body:
        ```
        {
        "sender": "607f1f77bcf86cd799439011",
        "receiver": "607f1f77bcf86cd799439012",
        "messageDetails": {
            "text": "Hello!"
            }
        }
        ```
        
        Response:
        201: Message sent successfully.
        500: Error sending message.
        
        Get a Conversation Between Two Users
        URL: /chat/conversation/:senderId/:receiverId
        Method: GET
        Response:
        200: Returns the conversation details.
        500: Error retrieving conversation