const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDatabase = require('./config/database.js');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes= require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');

const app = express();
const port = process.env.PORT ||8000;

dotenv.config();
app.use(cors());
app.use(express.json()); // This is crucial for parsing JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);

app.get("/", (req, res) => {
    res.send("API is running");
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(400).json({ message: err.message });
});

app.listen(port, () => {
    try {
        connectToDatabase();
        console.log("Listening on port " + port);
    } catch (error) {
        console.log("Error listening on server:", error);
    }
});
