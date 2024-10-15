const express = require('express');
const {registerUser,authUser, allUsers} = require('../controller/userControllers')
const multer = require('multer');
const authMiddleware = require('../config/authMiddleware')

const router = express.Router();
const upload = multer(); 

router.post('/register',upload.single('pic'),registerUser);
router.post('/login',authUser)
router.get('/',authMiddleware,allUsers)

module.exports = router; 