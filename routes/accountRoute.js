const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const { body } = require("express-validator");
const { checkLogin } = require("../middleware/checkLogin.js");  // <-- import here

// Login + Register Views
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Registration
router.post(
  "/register",
  regValidate.registrationRules(),  // <-- make sure this matches function name in validation file
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Login
router.post("/login", utilities.handleErrors(accountController.loginAccount));

// Logout
router.get("/logout", accountController.logoutAccount);

// Account Management
router.get(
  "/management",
  checkLogin,
  utilities.handleErrors(accountController.buildAccountManagementView)
);

// Account Update View (GET)
router.get(
  "/update/:accountId",
  checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdateView)
);

// Account Info Update (POST)
router.post(
  "/update-profile",
  checkLogin,
  body("account_firstname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters."),
  body("account_lastname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters."),
  body("account_email").trim().isEmail().withMessage("Please enter a valid email."),
  utilities.handleErrors(accountController.updateProfile)
);

// Password Update (POST)
router.post(
  "/update-password",
  checkLogin,
  body("new_password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
