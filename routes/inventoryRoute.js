// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to single vehicle view
router.get("/detail/:invId", invController.buildVehicleDetail);

// Route to trigger a 500 error intentionally
router.get("/testError", invController.testError);

module.exports = router;
