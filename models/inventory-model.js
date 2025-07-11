const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
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
    console.error("getInventoryByClassificationId error " + error);
  }
}

/* ********************
 * Retrieve single vehicle data
 ***************************** */
async function getVehicleById(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getVehicleById error " + error);
    throw error;
  }
}

/* ***************************
 * Get all inventory items
 * *************************** */
async function getAllInventory() {
  try {
    const data = await pool.query(
      `SELECT i.inv_id, i.inv_make, i.inv_model, c.classification_name 
       FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id
       ORDER BY c.classification_name, i.inv_make`
    );
    return data.rows;
  } catch (error) {
    throw new Error("getAllInventory error: " + error.message);
  }
}

/* ***************************
 * Delete Inventory Item
 * *************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    throw new Error("Delete Inventory Error: " + error.message);
  }
}

/* ***************************
 * Add a new classification
 * *************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    throw new Error("addClassification error: " + error.message);
  }
}



module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  deleteInventoryItem,
  getAllInventory,
  addClassification,
};
