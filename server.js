/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()
const session = require("express-session")
const flash = require("connect-flash")
const pgSession = require("connect-pg-simple")(session)

const pool = require("./database/")
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute") 
const utilities = require("./utilities")

const app = express()

/* ************************
 * Session Middleware
 ************************ */
app.use(session({
  store: new pgSession({
    pool,
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || "secret",
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

/* ***********************
 * Body Parsing Middleware
 ************************ */
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * Flash Message Middleware
 ************************ */
app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/* ***********************
 * View Engine and Layout
 ************************ */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Static Route Middleware
 ************************ */
app.use(static)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.get("/", utilities.handleErrors(baseController.buildHome))

/* ***********************
 * 404 Handler
 ************************ */
app.use((req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
 * Global Error Handler
 ************************ */
app.use(async (err, req, res, next) => {
  let nav = ''
  try {
    nav = await utilities.getNav()
  } catch (e) {
    console.error("Error building nav:", e)
  }

  const status = err.status || 500
  const view = status === 404 ? "errors/404" : "errors/500"

  res.status(status).render(view, {
    title: status,
    message: err.message || "Internal Server Error",
    nav,
  })
})

/* ***********************
 * Start Server
 ************************ */
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

