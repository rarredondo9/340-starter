// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities");

const { checkLogin, checkAccountType } = utilities;

// Route to build inventory by classification view (open to all)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to single vehicle view (open to all)
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetail));

// Route to trigger a 500 error intentionally (for testing)
router.get("/testError", utilities.handleErrors(invController.testError));

// Route to launch inventory management (Admin/Employee only)
router.get(
  "/",
  checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
);

// Route to add classification view (Admin/Employee only)
router.get(
  "/add-classification",
  checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.buildAddClassificationView)
);
router.post(
  "/add-classification",
  checkLogin,
  checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to add inventory view (Admin/Employee only)
router.get(
  "/add-inventory",
  checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.buildAddInventoryView)
);
router.post(
  "/add-inventory",
  checkLogin,
  checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to show delete confirmation (Admin/Employee only)
router.get(
  "/delete/:invId",
  checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventoryView)
);
router.post(
  "/delete",
  checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.deleteInventoryItem)
);

// edit/update inventory routes
router.get(
  "/edit/:invId",
  checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.buildEditInventoryView)
);
router.post(
  "/update",
  checkLogin,
  checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
);

module.exports = router;
