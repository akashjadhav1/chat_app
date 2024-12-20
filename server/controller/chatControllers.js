const Chat  = require('../models/chatModels')
const User = require('../models/userModel')

const accessChat = async(req,res)=>{
    const {userId} = req.body;

    if(!userId){
        console.log("Userid param not send with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email"    })


    if(isChat.length>0){
        res.send(isChat[0])
    }
    else{
        var chatData = {
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],

        }
        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password")

            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message);
        }

    }
}



const fetchChats = async (req, res) => {
    try {
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        // Populate the sender details of the latestMessage
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        // Send the populated chat data
        res.status(200).json(chats);
    } catch (error) {
        console.error(error.message); // Log the error for debugging
        res.status(500).json({ message: "Error fetching chats", error: error.message });
    }
};



const createGroupChat = async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"please fill all the fields"})
    }

    let users = JSON.parse(req.body.users);

    if(users.length<2){
        return res.status(400).send({message:"More than 2 users are required to form a group chat"})
    }
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        })

        const fullGroupChat = await Chat.findOne({_id:groupChat._id}).populate("users","-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}


const renameGroup = async(req,res)=>{
    const {chatId,chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId,{
        chatName:chatName,
    },
{
    new:true,
}
)
.populate("users","-password")
.populate("groupAdmin","-password")
if(!updatedChat){
    res.status(404);
    throw new Error("Chat not found")
}
else{
    res.json(updatedChat)
}

}


const addToGroup = async(req,res)=>{
    const {chatId,userId} = req.body;

    const added = await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    },
    {
        new: true,
    }

)
.populate("users","-password")
.populate("groupAdmin","-password")

if(!added){
    res.status(404);
    throw new Error("Chat not found")
}
else{
    res.json(added)
}
}




const removeFromGroup = async(req,res)=>{
    const {chatId,userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
    },
    {
        new: true,
    }

)
.populate("users","-password")
.populate("groupAdmin","-password")

if(!removed){
    res.status(404);
    throw new Error("Chat not found")
}
else{
    res.json(removed)
}
}


module.exports = {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}