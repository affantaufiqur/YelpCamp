const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async(req, res,) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index', { camp });
};

module.exports.new = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.newPost = async(req, res, next) => {
    if(!req.body) throw new ExpressError('Invalid Data', 400);
    const camp = new Campground(req.body);
    camp.user = req.user._id
    await camp.save();
    req.flash('success', 'Successfully added a new campground!')
    res.redirect(`/campground/${camp._id}`);
};

module.exports.show = async(req, res) => {
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
};

module.exports.edit = async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', 'Campground does not exist');
        return res.redirect('/campground');
    }
    
    res.render('campgrounds/edit', { camp });
};

module.exports.editPost = async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body});
    req.flash('success', 'Successfully edit a new campground!')
    res.redirect(`/campground/${camp._id}`);
};

module.exports.delete = async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
};