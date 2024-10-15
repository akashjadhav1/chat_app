const express = require('express');
const protect = require('../config/authMiddleware')

const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require('../controller/chatControllers')


const router = express.Router();
router.post('/',protect,accessChat);
router.get('/',protect,fetchChats);
router.post('/groups',protect,createGroupChat);
router.put('/rename',protect,renameGroup)
router.put('/groupadd',protect,addToGroup)
router.put('/groupremove',protect,removeFromGroup)


module.exports = router;