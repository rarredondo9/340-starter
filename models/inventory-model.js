const pool = require("../database");

/* ***************************
 * Get all classifications
 * *************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 * Get inventory by classification ID
 * *************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`, 
       [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("Error getting inventory by classification ID: " + error);
  }
}

/* ***************************
 * Get vehicle by ID
 * *************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`, [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("Error fetching vehicle by ID: " + error);
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById };
