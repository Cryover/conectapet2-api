const pg = require("pg");

if (!process.env.DATABASE_PROD_URL) {
  console.error("DATABASE_PROD_URL environment variable is not set");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_PROD_URL,
  ssl: { rejectUnauthorized: false },
  retry: {
    max: 3,
  },
  max: 10,
  idleTimeoutMillis: 20000, 
  connectionTimeoutMillis: 2000, 
});

function connectDatabase(req, res, next) {

  function logActiveConnections() {
    const activeConnections = pool.totalCount;
    console.log(`Active connections: ${activeConnections}`);
  }

  function attemptConnection() {
    pool.connect((err, client, done) => {
      if (err) {
        //console.log('URL', process.env.DATABASE_PROD_URL);
        console.error("Error acquiring client from pool", err);
        console.log("Error acquiring client from pool", err);
        
        done(client);

        setTimeout(attemptConnection, 5000);
      } else {
        client.on("error", (error) => {
          //console.log('URL', process.env.DATABASE_PROD_URL);
          console.error("Database connection error", error);
          console.log("Database connection error", error);
          
          done(client);

          setTimeout(attemptConnection, 5000);
        });
        

        req.dbClient = client;
        req.dbDone = done;
        logActiveConnections();
        next();
      }
    });
  }

  attemptConnection();
}

module.exports = connectDatabase;
