const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const { body } = require("express-validator")

// Middleware to check login status
const checkLogin = utilities.checkLogin

// Login + Register Views
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Login
router.post("/login", utilities.handleErrors(accountController.loginAccount))

// Logout
router.get("/logout", accountController.logoutAccount)

// Account Management
router.get(
  "/management",
  checkLogin,
  utilities.handleErrors(accountController.buildAccountManagementView)
)

// Account Update View (GET)
router.get(
  "/update/:accountId",
  checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdateView)
)

// Account Info Update (POST)
router.post(
  "/update-profile",
  checkLogin,
  // Validation middleware for update profile:
  body("account_firstname").trim().isLength({ min: 2 }).withMessage("First name must be at least 2 characters."),
  body("account_lastname").trim().isLength({ min: 2 }).withMessage("Last name must be at least 2 characters."),
  body("account_email").trim().isEmail().withMessage("Please enter a valid email."),
  // Custom email check is in controller or can be added here if desired
  utilities.handleErrors(accountController.updateProfile)
)

// Password Update (POST)
router.post(
  "/update-password",
  checkLogin,
  // Validate password requirements:
  body("new_password")
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character."),
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router
