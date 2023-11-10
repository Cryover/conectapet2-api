const express = require("express");
const app = express();
const dotenv = require("dotenv");
const requireAuth = require("./utils/jwtAuth");
const swaggerOptions = require("./swaggerhub-spec.json");

const options = {
  definition: swaggerOptions,
  apis: ["./routes/*.js", "./controllers/*.js"],
};
dotenv.config();

const PORT = process.env.PORT || 3000;

const connectDatabase = require("./dataBase");
const rotasLogin = require("./routes/rotasLogin");
const rotasPets = require("./routes/rotasPets");
const rotasUsuarios = require("./routes/rotasUsuarios");
const rotasConsulta = require("./routes/rotasConsulta");
const rotasDespesa = require("./routes/rotasDespesa");

app.use(connectDatabase);
app.use(express.json());

app.use("/api/v1/login", rotasLogin);
app.use("/api/v1/usuarios", requireAuth, rotasUsuarios);
app.use("/api/v1/pets", requireAuth, rotasPets);
app.use("/api/v1/consulta", requireAuth, rotasConsulta);
app.use("/api/v1/despesa", requireAuth, rotasDespesa);

// Set up Swagger documentation
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = swaggerJsdoc(options);

app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro 500 - Erro interno de Servidor" });
});

// 404 Not Found middleware
app.all("*", (req, res) => {
  res.status(404).json({
    error: "ERRO 404 - Rota não encontrada ou inexistente",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express está ouvindo na porta ${PORT}`);
  //console.log(`API URL: ${config.apiURL}`);
});
