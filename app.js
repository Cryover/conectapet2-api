const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
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
app.use(bodyParser.json());

app.use("/login", rotasLogin);
app.use("/usuarios", requireAuth, rotasUsuarios);
app.use("/pets", requireAuth, rotasPets);
app.use("/consulta", requireAuth, rotasConsulta);
app.use("/despesa", requireAuth, rotasDespesa);

// Set up Swagger documentation
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.all("*", (req, res) => {
  res.status(404).json({
    error: "ERRO 404 - Rota não encontrada ou inexistente",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Express está ouvindo na porta ${PORT}`);
  //console.log(`API URL: ${config.apiURL}`);
});
