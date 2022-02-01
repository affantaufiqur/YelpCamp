const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const review = require('../controllers/review');
const { validateReview, isLoggedIn, isReviewUser } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview)); 

router.delete('/:reviewId', isLoggedIn, isReviewUser, catchAsync(review.delete));

module.exports = router;