const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ArticleSchema = new Schema({
    title: String,
    body: String,
    date: Date,
    location: String, 
    lat: Schema.Types.Decimal128,
    lng: Schema.Types.Decimal128,
})

module.exports = mongoose.model('Article', ArticleSchema)