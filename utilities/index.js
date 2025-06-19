const invModel = require("../models/inventory-model")
const Util = {};


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ********************************
* Generate HTML for vehichle details
* ********************************* */
  function buildVehicleDetail(data) {
    return `
      <div class="vehicle-detail">
        <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
        <div class="vehicle-info">
          <h2>${data.inv_make} ${data.inv_model} (${data.inv_year})</h2>
          <p><strong>Price:</strong> $${Number(data.inv_price).toLocaleString()}</p>
          <p><strong>Mileage:</strong> ${Number(data.inv_miles).toLocaleString()} miles</p>
          <p><strong>Description:</strong> ${data.inv_description}</p>
          <p><strong>Color:</strong> ${data.inv_color}</p>
        </div>
      </div>
    `;
  }
/* ********************************
* Dropdown list for  Classification
* ********************************* */

  Util.buildClassificationList = async (classification_id = null) => {
  const data = await invModel.getClassifications();
  let list = '<select name="classification_id" id="classificationList" required>';
  list += '<option value="">Choose a Classification</option>';
  data.rows.forEach(row => {
    list += `<option value="${row.classification_id}"${row.classification_id == classification_id ? ' selected' : ''}>${row.classification_name}</option>`;
  });
  list += "</select>";
  return list;
};

/* ******************************************
 * Middleware to check if user is logged in
 ********************************************* */
const jwt = require("jsonwebtoken")

function checkAccountType(req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    req.flash("notice", "Please log in to access this page.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      req.accountData = decoded
      return next()
    } else {
      req.flash("notice", "You do not have permission to access this area.")
      return res.redirect("/account/login")
    }
  } catch (err) {
    req.flash("notice", "Session expired or invalid. Please log in again.")
    return res.redirect("/account/login")
  }
}


Util.checkAccountType = checkAccountType;
module.exports = Util;