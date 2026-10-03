const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80": v,
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        required: true
    },
    reviews: [
        {
         type: Schema.Types.ObjectId,
         ref: "Review",
    },
   
]
});
listingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing){
    await review.deletemany({_id:  {$in: listing.reviews}});
}
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;