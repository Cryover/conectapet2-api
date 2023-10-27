const express = require("express");
const app = express();
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDefinition = require("./swaggerhub-spec.json"); // Replace with your file path
const requireAuth = require("./utils/jwtAuth");

dotenv.config();

const PORT = process.env.PORT || 3000;

const connectDatabase = require("./dataBase"); // Import the middleware

const rotasLogin = require("./routes/rotasLogin");
const rotasPets = require("./routes/rotasPets");
const rotasUsuarios = require("./routes/rotasUsuarios");
const rotasHistoricoVeterinario = require("./routes/rotasHistoricoVeterinario");
const rotasHistoricoDespesas = require("./routes/rotasHistoricoDespesas");

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// Use the middlewares for all routes
app.use(connectDatabase);
app.use(bodyParser.json());

// Serve Swagger documentation using Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/login", rotasLogin);
app.use("/usuarios", requireAuth, rotasUsuarios);
app.use("/pets", requireAuth, rotasPets);
app.use("/historicovet", requireAuth, rotasHistoricoVeterinario);
app.use("/historicodespesas", requireAuth, rotasHistoricoDespesas);
app.all("*", (req, res) => {
  res.status(404).json({
    error: "ERRO 404 - Rota não encontrada ou inexistente",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express está ouvindo na porta ${PORT}`);
  console.log(`Conectado ao Database  ${connectDatabase.name}`);
});
