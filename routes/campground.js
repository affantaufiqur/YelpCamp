const express = require('express');
const router = express.Router();
const campground = require('../controllers/campground')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schema.js');
const {isLoggedIn, validateCamp, isUser} = require('../middleware');
const multer = require('multer');
const { storage } = require('../config')
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(campground.newPost));


router.get('/new', isLoggedIn, (campground.new));

router.route('/:id')
    .get(catchAsync(campground.show))
    .put(isLoggedIn, isUser, upload.array('image'), validateCamp, catchAsync(campground.editPost))
    .delete(isLoggedIn, isUser, catchAsync(campground.delete));

router.get('/:id/edit', isLoggedIn, isUser, catchAsync(campground.edit));


module.exports = router;