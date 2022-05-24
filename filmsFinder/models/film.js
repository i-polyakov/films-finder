const {Schema, model} = require('mongoose')

const filmSchema = new Schema({
    title: String,
    year: Number,
    released: Date,
    runtime: String,
    image: String,
    plot: String,
    directors:[String],
    writers:[String],
    actor:[String],
    genres:[String],
    countries:[String],
    imdb:{
        rating: Number,
        votes: Number,
        id: {
            type: String,
            required: true
        }
    },
    contentRating: String,
    metacriticRating: Number
})

filmSchema.index({"imdb.id": 1 }, {unique: true })
module.exports = model('Film', filmSchema) 