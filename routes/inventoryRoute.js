// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to single vehicle view
router.get("/detail/:invId", invController.buildVehicleDetail);

// Route to trigger a 500 error intentionally
router.get("/testError", invController.testError);

// Route to launch inventory management
router.get('/', invController.buildManagementView);

// Route to add classification view
router.get('/add-classification', invController.buildAddClassificationView);
router.post('/add-classification',
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification);

// Route to add invnetory view
router.get('/add-inventory', invController.buildAddInventoryView);

router.post('/add-inventory',
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
);


module.exports = router;
