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

/* ***********************
 * Index Route
 *************************/
app.get("/", baseController.buildHome)

/* ***********************
 * Error handling middleware
 *************************/
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500)
  res.send(`
    <h1>Server Error</h1>
    <p><strong>${err.message}</strong></p>
    <p>${err.stack}</p>
  `)
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`)
})

