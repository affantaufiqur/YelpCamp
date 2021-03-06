const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = {toJSON: { virtuals: true }}
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_400')
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        { 
        type: Schema.Types.ObjectId,
        ref: 'Review'
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<a href="/campground/${this._id}">${this.title}</a><br><p>${this.location}</p>`
})

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);