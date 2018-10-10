const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ArticleSchema = new Schema({
    title: String,
    body: String,
    date: Date,
    location: String, 
    lat: Number,
    lng: Number
})

module.exports = mongoose.model('Article', ArticleSchema)