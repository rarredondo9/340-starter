const pool = require("../database/")

/* *****************************
*   Register new account
* ***************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get account by email
* ***************************** */
async function getAccountByEmail(account_email) {
  const sql = "SELECT * FROM account WHERE account_email = $1"
  const result = await pool.query(sql, [account_email])
  return result.rows[0]
}

/* *****************************
*   Get account by ID
* ***************************** */
async function getAccountById(account_id) {
  const sql = "SELECT * FROM account WHERE account_id = $1"
  const result = await pool.query(sql, [account_id])
  return result.rows[0]
}

/* *****************************
*   Update first name, last name, email
* ***************************** */
async function updateAccountInfo(account_id, firstname, lastname, email) {
  const sql = `
    UPDATE account
    SET account_firstname = $1, account_lastname = $2, account_email = $3 
    WHERE account_id = $4
    RETURNING *;
  `
  const values = [firstname, lastname, email, account_id]
  return pool.query(sql, values)
}

/* *****************************
*   Update password
* ***************************** */
async function updateAccountPassword(account_id, hashedPassword) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *;
  `
  const values = [hashedPassword, account_id]
  return pool.query(sql, values)
}

module.exports = { 
  registerAccount, 
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  updateAccountPassword 
}
