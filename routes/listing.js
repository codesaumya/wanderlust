const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");


const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//index Route
router.get("/",wrapAsync(async (req,res) => {
    const alllistings = await Listing.find({});
        res.render("listings/index.ejs",{alllistings});

}));


//new route
router.get("/new", isLoggedIn,(req, res) =>{
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Lsting you requested for for does not exist");
        res.redirect("/listings");   
    }
    res.render("listings/show.ejs",{listing});
}));
//create route
router.post("/",isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) =>{
    if (!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);

    await newListing.save();
     req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));
//edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update Route
router.put("/:id",isLoggedIn,wrapAsync (async (req, res) =>{
    if (!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id} = req.params;
    console.log(req.body.listing);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));

//delete Route
router.delete("/:id", isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "New Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;