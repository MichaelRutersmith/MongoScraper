//require mongoose
var mongoose = require("mongoose");
// use mongoose for Schema
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    body: {
        type: String,
        required: true
    }
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;