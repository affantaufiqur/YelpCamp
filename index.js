const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => {
    console.log('Nice, you are connected')
})
.catch(e => {
    console.log('Not nice, you are not connected')
    console.log(e)
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=>{
    console.log('db connected')
});

const app = express();

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campground', async(req, res) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index', { camp });
});

app.get('/campground/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campground', async(req, res) => {
    const camp = new Campground(req.body);
    await camp.save();
    res.redirect(`/campground/${camp._id}`);
});

app.get('/campground/:id', async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show', { camp });
});

app.get('/campground/:id/edit', async(req, res)=>{
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
});

app.put('/campground/:id', async(req, res)=>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body});
    res.redirect(`/campground/${camp._id}`);
});

app.delete('/campground/:id', async(req, res)=>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
});

app.listen(3000, () => {
    console.log('listen 3000')
});