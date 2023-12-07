const pg = require("pg");

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_PROD_URL,
  ssl: true,
});

/* const pool = new pg.Pool({
  connectionString: process.env.DATABASE_PROD2_URL,
  ssl: process.env.DATABASE_PROD2_URL ? true : false,
}); */

function connectDatabase(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      console.log('URL', process.env.DATABASE_PROD_URL)
      console.log("Error acquiring client from pool", err);
      console.error("Error acquiring client from pool", err);
      return res.status(500).json({ message: "ERRO 500 - Database connection error" });
    } else {
      //console.log("Connected to Database");
    }

    // Set up an event listener to handle connection errors
    client.on("error", (error) => {
      console.log('URL', process.env.DATABASE_PROD_URL)
      console.error("Database connection error", error);
      console.log("Database connection error", error);
      // Release the client explicitly to avoid leaving the connection in a bad state
      done(client);
      process.send('reload');
      //setTimeout(connect, 5000);
    });

    req.dbClient = client;
    req.dbDone = done;
    next();
  });
}

module.exports = connectDatabase;
