const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require("../middleware/auth");

//Middleware off email validation, to make a email verification require on signup
const emailValid = require('../middleware/emailValid')
router.post('/signup', emailValid, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;