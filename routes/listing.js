const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/warpAsync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
    .get(warpAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        warpAsync(listingController.createListing));


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get(warpAsync(listingController.showListings))
    .put(isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        warpAsync(listingController.updateListing))
    .delete(isLoggedIn,
        isOwner,
        warpAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn,
    isOwner,
    warpAsync(listingController.renderEditForm));

module.exports = router;