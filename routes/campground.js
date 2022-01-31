const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schema.js');
const {isLoggedIn} = require('../middleware');

const validateCamp = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

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
    await camp.save();
    req.flash('success', 'Successfully added a new campground!')
    res.redirect(`/campground/${camp._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if(!camp){
        req.flash('error', 'Cannot find the camground');
        return res.redirect('/campground');
    }
    res.render('campgrounds/show', { camp });
}));

router.get('/:id/edit', catchAsync(async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
}));

router.put('/:id', validateCamp, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body});
    req.flash('success', 'Successfully edit a new campground!')
    res.redirect(`/campground/${camp._id}`);
}));

router.delete('/:id', catchAsync(async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
}));

module.exports = router;