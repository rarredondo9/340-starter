const { body, validationResult } = require("express-validator");
const invValidate = {};

// Validation for classification
invValidate.classificationRules = function () {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9 ]+$/)
      .withMessage("Classification name must be alphanumeric."),
  ];
};

invValidate.checkClassificationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" "));
    return res.redirect("/inv/add-classification");
  }
  next();
};

// Validation for inventory
invValidate.inventoryRules = () => [
  body("inv_make")
    .trim()
    .notEmpty()
    .withMessage("Make is required."),
  body("inv_model")
    .trim()
    .notEmpty()
    .withMessage("Model is required."),
  body("inv_year")
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage("Enter a valid year."),
  body("inv_price")
    .isFloat({ min: 0 })
    .withMessage("Enter a valid price."),
  body("inv_miles")
    .isInt({ min: 0 })
    .withMessage("Enter a valid mileage."),
  body("inv_color")
    .trim()
    .notEmpty()
    .withMessage("Color is required."),
  body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
];

// ✅ ADD THIS — you forgot to define this earlier
invValidate.checkInventoryData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" "));
    return res.redirect("/inv/add-inventory");
  }
  next();
};

// ✅ FIX THIS LINE
module.exports = invValidate;
