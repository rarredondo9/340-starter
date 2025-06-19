const { Pool } = require("pg")
require("dotenv").config()

// Log the environment variables for debugging
console.log("NODE_ENV:", process.env.NODE_ENV) // Should be 'production' on Render
console.log("Database URL:", process.env.DATABASE_URL) // Should be the correct remote DB URL

let pool

// Check the environment and configure the connection pool accordingly
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // No SSL needed for local development
  })
} else {
  // Production environment (Render)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, 
    },
  })
}

// Export the query function for use throughout the app
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}
