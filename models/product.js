var mongoose = require("mongoose");

// SCHEMA SETUP
var productSchema = new mongoose.Schema({
    name: String,
    brand: String,
    catagory: String,
    cost: Number,
    description: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
    author: {
    	id: {
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "User"
    	},
    	username: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

// return the model
module.exports = mongoose.model("Product", productSchema);