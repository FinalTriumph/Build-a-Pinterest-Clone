"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Image = new Schema({
    image: {
        title: String,
        url: String,
        user: String,
        name: String
    }
});

module.exports = mongoose.model("Image", Image);