let mongoose = require('mongoose');

let restaurantSchema = new mongoose.Schema({
    name: String,
    adress: String,
    image: String,
    capacity: Number,
    description: String,
    cuisine: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);