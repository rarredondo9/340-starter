const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.session.accountData = regResult.rows[0]
    req.flash("notice", `Congratulations, you're registered ${account_firstname}.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("error", "Email not found.")
    return res.status(401).render("account/login", {
      title: "Login",
      nav,
    })
  }

  // Use bcrypt.compare since passwords should be hashed
  const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
  if (!passwordMatch) {
    req.flash("error", "Incorrect password.")
    return res.status(401).render("account/login", {
      title: "Login",
      nav,
    })
  }

  req.session.accountData = accountData

  const token = jwt.sign(
    {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )

  res.cookie("jwt", token, { httpOnly: true })

  req.flash("success", `Welcome back, ${accountData.account_firstname}!`)
  res.redirect("/inv")
}

/* ****************************************
*  Process Logout
* *************************************** */
function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.session.destroy(err => {
    if (err) {
      console.error("Session destruction error:", err)
      req.flash("error", "Logout failed. Please try again.")
      return res.redirect("/account/management")
    }
    res.redirect("/")
  })
}

/* ****************************************
*  Deliver Account Management View
* *************************************** */
async function buildAccountManagementView(req, res) {
  const nav = await utilities.getNav()
  const accountData = req.session.accountData

  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData
  })
}

/* ****************************************
* Deliver Account Update View
* *************************************** */
async function buildAccountUpdateView(req, res, next) {
  const nav = await utilities.getNav()
  const accountId = req.params.accountId

  if (!req.session.accountData || req.session.accountData.account_id != accountId) {
    req.flash("error", "Unauthorized access.")
    return res.redirect("/account/management")
  }

  try {
    const account = await accountModel.getAccountById(accountId)

    if (!account) {
      req.flash("error", "Account not found.")
      return res.redirect("/account/management")
    }

    res.render("account/update", {
      title: "Update Account Information",
      nav,
      account,
      messages: req.flash(),
      formData: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
* Process Account Info Update
* *************************************** */
async function updateProfile(req, res, next) {
  const nav = await utilities.getNav()
  const errors = validationResult(req)
  const formData = {
    account_firstname: req.body.account_firstname,
    account_lastname: req.body.account_lastname,
    account_email: req.body.account_email,
    account_id: req.body.account_id,
  }

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Update Account Information",
      nav,
      account: formData,
      messages: { error: errors.array().map(e => e.msg) },
      formData,
    })
  }

  try {
    const result = await accountModel.updateAccountInfo(
      formData.account_id,
      formData.account_firstname,
      formData.account_lastname,
      formData.account_email
    )

    if (result.rowCount > 0) {
      // Refresh session data
      const freshAccount = await accountModel.getAccountById(formData.account_id)
      req.session.accountData = freshAccount

      req.flash("success", "Account information updated successfully.")
      return res.redirect("/account/management")
    } else {
      req.flash("error", "Account update failed.")
      return res.redirect("/account/update/" + formData.account_id)
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
* Process Password Change
* *************************************** */
async function updatePassword(req, res, next) {
  const nav = await utilities.getNav()
  const errors = validationResult(req)
  const accountId = req.body.account_id
  const newPassword = req.body.new_password

  if (!req.session.accountData || req.session.accountData.account_id != accountId) {
    req.flash("error", "Unauthorized access.")
    return res.redirect("/account/management")
  }

  if (!newPassword) {
    req.flash("error", "Password cannot be empty.")
    return res.redirect("/account/update/" + accountId)
  }

  if (!errors.isEmpty()) {
    try {
      const account = await accountModel.getAccountById(accountId)
      return res.status(400).render("account/update", {
        title: "Update Account Information",
        nav,
        account,
        messages: { error: errors.array().map(e => e.msg) },
        formData: null,
      })
    } catch (error) {
      next(error)
    }
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const result = await accountModel.updateAccountPassword(accountId, hashedPassword)

    if (result.rowCount > 0) {
      req.flash("success", "Password updated successfully.")
      return res.redirect("/account/management")
    } else {
      req.flash("error", "Password update failed.")
      return res.redirect("/account/update/" + accountId)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  logoutAccount,
  buildAccountManagementView,
  buildAccountUpdateView,
  updateProfile,
  updatePassword,
}
