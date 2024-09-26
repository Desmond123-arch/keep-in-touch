# Chat Application

This is a real-time chat application built using Node.js, Socket.IO, and MongoDB. Users can chat with each other, see online status, and enjoy a responsive chat interface.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Community Edition)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

Follow these steps to set up and run the chat application:

### 1. Clone the Repository

```bash
git clone https://github.com/Desmond123-arch/keep-in-touch
cd keep-in-touch
```
### 2. Start the mongod and server
```
cd server
sudo service mongod start
npm install
node socket.js
```
### 3. Start the app
```
cd app
npm install
npm run dev
```
### 3. Access the application
```
http://localhost:5173/
```

## Key features
```
Real-time messaging
User online status
Responsive chat interface
Message history
```
## Technologies used
```
Frontend: React, Tailwindcss
Backend: Node.js, Express, Socket.IO
Database: MongoDB
```
## Contributing
Contributions are welcome! Please create a pull request or open an issue for any enhancements or bug fixes.


