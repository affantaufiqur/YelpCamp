const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schema.js');
const {isLoggedIn, validateCamp, isUser} = require('../middleware');

router.get('/', async(req, res,) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index', { camp });
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCamp, catchAsync(async(req, res, next) => {
    if(!req.body) throw new ExpressError('Invalid Data', 400);
    const camp = new Campground(req.body);
    camp.user = req.user._id
    await camp.save();
    req.flash('success', 'Successfully added a new campground!')
    res.redirect(`/campground/${camp._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'user'
        }
    }).populate('user');
    if(!camp){
        req.flash('error', 'Cannot find the camground');
        return res.redirect('/campground');
    }
    res.render('campgrounds/show', { camp });
}));

router.get('/:id/edit', isLoggedIn, isUser, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', 'Campground does not exist');
        return res.redirect('/campground');
    }
    
    res.render('campgrounds/edit', { camp });
}));

router.put('/:id', isLoggedIn, isUser, validateCamp, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body});
    req.flash('success', 'Successfully edit a new campground!')
    res.redirect(`/campground/${camp._id}`);
}));

router.delete('/:id', isLoggedIn, isUser, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
}));

module.exports = router;