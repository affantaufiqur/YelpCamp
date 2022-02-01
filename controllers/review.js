const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req, res)=> {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body);
    review.user = req.user._id;
    camp.reviews.push(review);
    review.save();
    camp.save();
    req.flash('success', 'Successfully created new review');
    res.redirect(`/campground/${camp._id}`)
}

module.exports.delete = async(req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${camp._id}`)
}