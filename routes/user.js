const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');

router.route('/register')
.get(user.register)
.post(catchAsync(user.registerPost))

router.route('/login')
.get(user.login)
.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (user.loginPost));

router.get('/logout', user.logout);

module.exports = router;