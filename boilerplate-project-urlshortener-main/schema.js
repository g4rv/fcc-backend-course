const mongoose = require('mongoose')
const shortURL = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    originalURL: {
        type: String,
        required: true
    }
})

const ShortURL = mongoose.model('ShortURL', shortURL)

exports.URLModel = ShortURL