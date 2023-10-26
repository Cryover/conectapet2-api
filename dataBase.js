const pg = require("pg");

// Create a connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

// Middleware to acquire a database connection from the pool
function connectDatabase(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      console.error("Error acquiring client from pool", err);
      return res.status(500).json({ error: "Database connection error" });
    } else {
      //console.log("Connected to Database");
    }

    // Attach the database client and done function to the request object
    req.dbClient = client;
    req.dbDone = done;
    next();
  });
}

module.exports = connectDatabase;
