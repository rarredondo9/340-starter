// middleware/checkLogin.js

function checkLogin(req, res, next) {
  if (req.cookies && req.cookies.jwt) {
    return next(); // User is logged in
  }
  req.flash("notice", "Please log in to access this page.");
  res.redirect("/account/login");
}

module.exports = { checkLogin };
