const pool = require("../database");

async function addReview(inv_id, account_id, review_text) {
  const sql = `
    INSERT INTO reviews (inv_id, account_id, review_text)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const data = await pool.query(sql, [inv_id, account_id, review_text]);
  return data.rows[0];
}

async function getReviewsByVehicleId(inv_id) {
  const sql = `
    SELECT r.review_text, r.review_date, a.account_firstname, a.account_lastname
    FROM reviews r
    JOIN account a ON r.account_id = a.account_id
    WHERE r.inv_id = $1
    ORDER BY r.review_date DESC;
  `;
  const data = await pool.query(sql, [inv_id]);
  return data.rows;
}

module.exports = { addReview, getReviewsByVehicleId };
