const mongoose = require('mongoose');

/* 
    Image Schema for storing images in the 
    mongodb database
*/
var ImageSchema = mongoose.Schema({
    imageName: {
        type: String,
        default: "none",
        required: true
    },
    imageData: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', ImageSchema);