/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const session = require("express-session")
const flash = require("connect-flash")

const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require('./utilities')

/* ***********************
 * View Engine Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "secret", // fallback if .env is missing
  resave: true,
  saveUninitialized: true,
  name: 'sessionId'
}))

// Flash messages middleware
app.use(flash())

// Middleware to expose flash messages to views
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(static)
// Inventory routes
app.use("/inv", inventoryRoute)

// Index Route - must be before 404 catch-all
app.get("/", utilities.handleErrors(baseController.buildHome))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = '';
  try {
    nav = await utilities.getNav();
  } catch (e) {
    console.error("Error building nav in error handler:", e);
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  const view = status === 404 ? "errors/404" : "errors/500";

  res.status(status).render(view, {
    title: status,
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${port}`)
})
