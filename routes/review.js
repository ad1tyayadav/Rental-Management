const express = require("express");
const router = express.Router({ mergeParams: true });
const warpAsync = require("../utils/warpAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js")

//Reviews post route
router.post("/", validateReview, isLoggedIn, warpAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, warpAsync(reviewController.destroyReview));

module.exports = router;