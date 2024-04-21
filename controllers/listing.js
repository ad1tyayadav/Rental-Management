const axios = require('axios');
const Listing = require("../models/listing.js");

const MAPTILER_API_KEY = process.env.MAP_API;

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    const address = req.body.listing.location; // Or use a dynamic address from `req.body` or similar
    const geocodeUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${MAPTILER_API_KEY}`;

    const response = await axios.get(geocodeUrl);

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = {
        type: "Point",
        coordinates: response.data.features[0].geometry.coordinates
    };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings")
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    const newLocation = req.body.listing.location;

    if (listing.location !== newLocation) {
        const geocodeUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(newLocation)}.json?key=${MAPTILER_API_KEY}`;
        const response = await axios.get(geocodeUrl);
        listing.geometry = {
            type: "Point",
            coordinates: response.data.features[0].geometry.coordinates
        };
    };

    listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing, geometry: listing.geometry });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    };
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};