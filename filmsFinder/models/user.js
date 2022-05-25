const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'user'
    },
    following:[{
        type: Schema.Types.ObjectId,
        ref:'User'
    }],
    followers:[{
        type: Schema.Types.ObjectId,
        ref:'User'
    }],
    want:[{
        type: Schema.Types.ObjectId,
        ref:'Film'  
    }],
    watched:[{
        filmId:{
            type: Schema.Types.ObjectId,
            ref:'Film'
        },
        rating:{
            type: Number,
            min: 1,
            max: 10
        },
        review: String
    }],
    profile:{
        name: String,
        biography: String,
        avatar: String
    }
})

userSchema.index({login: 1 }, {unique: true })

module.exports = model('User', userSchema)