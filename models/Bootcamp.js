const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const geocoder = require('../util/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name must not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true,'Please add a descrition'],
        maxlength: [500, 'Description must not be more than 500 characters']
    },
    website: {
        type: String,
        match:[/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid  URL and HTTP or HTTPS']
},
phone: {
    type: String,
    maxlength: [20, 'Phone number must not be more than 20 chracters' ]
},
email: {
    type: String,
    match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
},
address: {
    type: String,
    required: [true, 'Please add an address']
},
location: {
    type: {
      type: String,
      enum: ['Point'],
     
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
},
careers: {
    type: [String],
    required: true,
    enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other'
    ]
},
averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must not be more than 10']
},
averageCost: Number,
photo: {
    type: String,
    default: 'no-photo.jpg'
},
housing: {
    type: Boolean,
    default: false
},
jobAssistance: {
    type: Boolean,
    default: false
},
jobGuarantee: {
    type: Boolean,
    default: false
},
acceptGi: {
    type: Boolean,
    default: false,
},
createdAt: {
    type: Date,
    default: Date.now
},
user:{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
}
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});
BootcampSchema.virtual('courses',{
    ref:'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false,
})

BootcampSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

BootcampSchema.pre('save',async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
     typpe: 'Point',
     coordinates: [loc[0].longitude, loc[0].latitude],
     formattedAddress: loc[0].formattedAddress,
     country: loc[0].countryCode,
     state: loc[0].stateCode,
     city: loc[0].city,
     zipcode: loc[0].zipcode,
     street: loc[0].streetName
    }
    this.address = undefined;
    next()
})
module.exports = mongoose.model('Bootcamp', BootcampSchema);