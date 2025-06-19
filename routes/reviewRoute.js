const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/");
const { checkLogin } = require("../utilities/account-validation"); // adjust path as needed

router.post("/add", utilities.handleErrors(reviewController.addReview));

module.exports = router;
