const express = require("express");
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
const requireAuth = require("./utils/jwtAuth");
const swaggerOptions = require("../swaggerhub-spec.json");
const winston = require('winston');

const options = {
  definition: swaggerOptions,
  apis: ["./routes/*.js", "./controllers/*.js"],
};
dotenv.config();

const PORT = process.env.PORT || 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const connectDatabase = require("./dataBase");
const rotasLogin = require("./routes/rotasLogin");
const rotasPets = require("./routes/rotasPets");
const rotasUsuarios = require("./routes/rotasUsuarios");
const rotasCompromisso = require("./routes/rotasCompromisso");
const rotasDespesa = require("./routes/rotasDespesa");

app.use(cors());
app.use(connectDatabase);
app.use(express.json());

app.use("/api/v1/login", rotasLogin);
app.use((req, res, next) => {
  const activeConnections = pool.totalCount;
  console.log(`Active connections: ${activeConnections}`);
  next();
});
app.use("/api/v1/usuarios", requireAuth, rotasUsuarios);
app.use((req, res, next) => {
  const activeConnections = pool.totalCount;
  console.log(`Active connections: ${activeConnections}`);
  next();
});
app.use("/api/v1/pets", requireAuth, rotasPets);
app.use((req, res, next) => {
  const activeConnections = pool.totalCount;
  console.log(`Active connections: ${activeConnections}`);
  next();
});
app.use("/api/v1/compromisso", requireAuth, rotasCompromisso);
app.use((req, res, next) => {
  const activeConnections = pool.totalCount;
  console.log(`Active connections: ${activeConnections}`);
  next();
});
app.use("/api/v1/despesa", requireAuth, rotasDespesa);
app.use((req, res, next) => {
  const activeConnections = pool.totalCount;
  console.log(`Active connections: ${activeConnections}`);
  next();
});

// Set up Swagger documentation
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = swaggerJsdoc(options);

app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({ message: "Erro 500 - Erro interno de Servidor" });
});

// 404 Not Found middleware
app.all("*", (req, res) => {
  return res.status(404).json({
    message: "ERRO 404 - Rota não encontrada ou inexistente",
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log or handle the error as needed
  logger.error('Uncaught Exception:', err);
  // Optionally, you might want to gracefully shut down the application
});

app.listen(PORT, () => {
  console.log(`Servidor Express está ouvindo na porta ${PORT}`);
  //console.log(`API URL: ${config.apiURL}`);
});
