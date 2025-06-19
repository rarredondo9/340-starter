const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");

// Inventory home page
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Inventory by classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Vehicle detail page
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildVehicleDetail)
);

// Add classification form
router.get("/add-classification", invController.buildAddClassificationView);
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Add inventory form
router.get("/add-inventory", utilities.checkAccountType, invController.buildAddInventoryView);
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

// Edit inventory form
router.get("/edit/:invId", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventoryView));
router.post("/edit/:invId", utilities.handleErrors(invController.updateInventoryItem));

// Delete inventory form
router.get("/delete/:invId", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInventoryView));
router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem));

module.exports = router;
