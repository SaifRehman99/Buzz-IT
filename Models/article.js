const mongoose = require("mongoose");

let Articles = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

// exporting the schema in the form of model
module.exports = mongoose.model("Articles", Articles);