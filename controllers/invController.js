const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* **************************
 * Build single vehicle view
 * *************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    const vehicle = await invModel.getVehicleById(inv_id);
    if (!vehicle) {
      const error = new Error('Vehicle not found');
      error.status = 404;
      return next(error);
    }
    const nav = await utilities.getNav();

    const vehicleDetails = {
      make: vehicle.inv_make,
      model: vehicle.inv_model,
      year: vehicle.inv_year,
      image: vehicle.inv_image,
      price: vehicle.inv_price.toLocaleString(),
      miles: vehicle.inv_miles.toLocaleString(),
      color: vehicle.inv_color,
      description: vehicle.inv_description,
    };

    res.render("./inventory/vehicleDetail", {
      title: `${vehicleDetails.make} ${vehicleDetails.model}`,
      nav,
      vehicleDetails
    });
  } catch (error) {
    next(error);
  }
};

/* **************************
 * Test error
 * *************************** */
invCont.testError = (req, res, next) => {
  const err = new Error("This is an intentional server error for testing purposes.");
  err.status = 500;
  next(err);
};

/* **************************
 * Build inventory management view
 * *************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      }
    });
  } catch (error) {
    next(error);
  }
};

/* **************************
 * Build add classification view
 * *************************** */
invCont.buildAddClassificationView = (req, res) => {
  res.render('inventory/add-classification', {
    title: 'Add Classification',
    messages: { error: req.flash('error') }
  });
};

invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body;
  const insertResult = await invModel.addClassification(classification_name);
  if (insertResult) {
    req.flash("success", "Classification added successfully.");
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: { success: req.flash("success") }
    });
  } else {
    req.flash("error", "Failed to add classification.");
    res.redirect("/inv/add-classification");
  }
};


/* **************************
 * Build add inventory view
 * *************************** */
invCont.buildAddInventoryView = async (req, res) => {
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    classificationSelect,
    messages: { error: req.flash("error") },
  });
};

invCont.addInventory = async (req, res) => {
  const formData = req.body;
  const insertResult = await invModel.addInventory(formData);
  if (insertResult) {
    req.flash("success", "Inventory item added.");
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(formData.classification_id);
    req.flash("error", "Failed to add inventory item.");
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationSelect,
      ...formData,
      messages: { error: req.flash("error") },
    });
  }
};



module.exports = invCont;

