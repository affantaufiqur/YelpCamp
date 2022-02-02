const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors} = require('./seed');

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
            user: '61f775f21893af2cafa681e1',
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est molestias doloribus enim error praesentium, similique odio ea eveniet, commodi impedit fugiat magni laudantium veniam a doloremque alias vero necessitatibus recusandae.',
            price,
            geometry: {
                type : "Point",
                coordinates : [ -73.9496, 40.6501 ],
            },
            images: [
                {
                    url : 'https://res.cloudinary.com/dbjmfhsvj/image/upload/v1643693976/YelpCamp/nh38jnbmfqsyyn42cpxn.png', 
                    filename : 'YelpCamp/nh38jnbmfqsyyn42cpxn'
                },
                {
                    url : 'https://res.cloudinary.com/dbjmfhsvj/image/upload/v1643693975/YelpCamp/hjzgnoyk8o2lk6sgv934.jpg', 
                    filename : 'YelpCamp/hjzgnoyk8o2lk6sgv934'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {mongoose.connection.close();});