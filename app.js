const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const rotasItems = require("./routes/rotasItems");
const rotasPets = require("./routes/rotasPets");
const rotasUsuarios = require("./routes/rotasUsuarios");
const rotasHistoricoVeterinario = require("./routes/rotasHistoricoVeterinario");
const rotasHistoricoDespesas = require("./routes/rotasHistoricoDespesas");

// Define Swagger specification using your SwaggerHub OpenAPI Specification
const swaggerDefinition = require("./swaggerhub-spec.json"); // Replace with your file path

// Options for the Swagger JSdoc
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Define your route files
};

// Initialize the Swagger JSdoc
const swaggerSpec = swaggerJSDoc(options);

// Serve Swagger documentation using Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", rotasUsuarios);
app.use("/items", rotasItems);
app.use("/pets", rotasPets);
app.use("/historicovet", rotasHistoricoVeterinario);
app.use("/despesas", rotasHistoricoDespesas);

app.listen(PORT, () => {
  console.log(`Servidor Express está ouvindo na porta ${PORT}`);
});
