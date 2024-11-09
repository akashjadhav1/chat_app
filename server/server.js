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

const server = app.listen(port, () => {
    try {
        connectToDatabase();
        console.log("Listening on port " + port);
    } catch (error) {
        console.log("Error listening on server:", error);
    }
});

const io = require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:[
            'https://chat-19ot8k1dr-akashjadhav1s-projects.vercel.app',
            'http://localhost:3000'
        ],
        methods: ["GET", "POST"]
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io server");
    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    })

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("user joined " + room)
    })

    socket.on('new message',(newMessageRecieved)=>{
        let chat = newMessageRecieved.chat;
        if(!chat.users){
            return;
            console.log("chat.users not define")
        }
        chat.users.forEach(user=>{
            if(user._id == newMessageRecieved.sender._id){
                return; 

                
            }
            socket.in(user._id).emit('message received', newMessageRecieved)
        })
    })

    socket.on('typing',(room)=>socket.in(room).emit('typing'))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))
})
 