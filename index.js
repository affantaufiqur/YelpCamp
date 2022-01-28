const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')


const campgrounds = require('./routes/campground')
const reviews = require('./routes/review')


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

app.use('/campground', campgrounds)
app.use('/campground/:id/reviews', reviews)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something wrong'
    res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
    console.log('listen 3000')
});