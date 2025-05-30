const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

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

    // Construct the HTML for the vehicle details directly here
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

    res.render("./inventory/vehicleDetail.ejs", { 
      title: `${vehicleDetails.make} ${vehicleDetails.model}`, 
      nav, 
      vehicleDetails // Pass the details object instead
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


module.exports = invCont;
