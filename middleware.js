const Campground = require('./models/campground');
const Review = require('./models/review');
const {campgroundSchema, reviewSchema} = require('./schema.js');
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login to continue');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCamp = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

module.exports.isUser = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp.user.equals(req.user._id)){
        req.flash('error', 'Permission denied');
        return res.redirect(`/campground/${camp._id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next(); 
    }
}

module.exports.isReviewUser = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.user.equals(req.user._id)){
        req.flash('error', 'Permission denied');
        return res.redirect(`/campground/${camp._id}`)
    }
    next();
}