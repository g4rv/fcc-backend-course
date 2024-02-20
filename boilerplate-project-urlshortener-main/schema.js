const mongoose = require('mongoose')
const shortURL = new mongoose.Schema({
    shortURL: {
        type: Number,
        required: true
    },
    originalURL: {
        type: String,
        required: true
    }
})

const ShortURL = mongoose.model('ShortURL', shortURL)

exports.URLModel = ShortURL