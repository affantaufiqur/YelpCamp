const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const {cloudinary} = require('../config')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCode = mbxGeocoding({ accessToken: mapBoxToken })


module.exports.index = async(req, res,) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index', { camp });
};

module.exports.new = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.newPost = async(req, res, next) => {
    const map = await geoCode.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    if(!req.body) throw new ExpressError('Invalid Data', 400);
    const camp = new Campground(req.body);
    camp.geometry = map.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
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
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...images);
    await camp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully edit a new campground!')
    res.redirect(`/campground/${camp._id}`);
};

module.exports.delete = async(req, res) =>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
};