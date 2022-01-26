const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seed');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000 );
        const price = Math.floor(Math.random() * 100 ) + 5;

        const camp = new Campground({
            title: `${sample(places)} ${sample(descriptors)}`,
            location: `${cities[random].city}, ${cities[random].state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est molestias doloribus enim error praesentium, similique odio ea eveniet, commodi impedit fugiat magni laudantium veniam a doloremque alias vero necessitatibus recusandae.',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {mongoose.connection.close();});