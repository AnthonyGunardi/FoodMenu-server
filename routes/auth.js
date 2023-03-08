const express = require('express');
const authController =require('../controllers/auth');
const router= express.Router();
const User=require('../model/user');

router.post('/register', authController.register);

module.exports = router;
