const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {reviewSchema} = require('../schema.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next(); 
    }
}

router.post('/', validateReview, catchAsync(async(req, res)=> {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body);
    camp.reviews.push(review);
    review.save();
    camp.save();
    req.flash('success', 'Successfully created new review');
    res.redirect(`/campground/${camp._id}`)
})) 

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${camp._id}`)
}))

module.exports = router;