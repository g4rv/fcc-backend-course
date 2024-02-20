const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: String,
})

const Exercise = mongoose.model('exercise', exerciseSchema)

exports.Exercise = Exercise