//require mongoose
var mongoose = require ("mongoose");
// use mongoose for Schema
var Schema = mongoose.Schema;

// create article schema
var articleSchema = new Schema({
//title of article
    title: {
        type : String, 
        required: true,
        unique: true
    }, 
// link to article
    link: {
        type: String,
        required: true
    },
// thumbnail for article
    thumbnail: {
        type: String, 
        required: true
    }, 
// save boolean
    saved: {
        type: Boolean,
        required: true
    },
// notes are taken from note schema
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

var article = mongoose.model("Article", articleSchema);

module.exports = article;