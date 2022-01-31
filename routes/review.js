const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {reviewSchema} = require('../schema.js');
const { validateReview, isLoggedIn, isReviewUser } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res)=> {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body);
    review.user = req.user._id;
    camp.reviews.push(review);
    review.save();
    camp.save();
    req.flash('success', 'Successfully created new review');
    res.redirect(`/campground/${camp._id}`)
})) 

router.delete('/:reviewId', isLoggedIn, isReviewUser, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${camp._id}`)
}))

module.exports = router;