const utilities = require("../utilities/");
const baseController = {};


baseController.buildHome = async function(req, res){
  const nav = [];  // fallback empty nav
res.render("index", {title: "Home", nav});
};

module.exports = baseController;