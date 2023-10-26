const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const rotasItems = require("./routes/rotasItems");
const rotasPets = require("./routes/rotasPets");
const rotasUsuarios = require("./routes/rotasUsuarios");
const rotasHistoricoVeterinario = require("./routes/rotasHistoricoVeterinario");
const rotasHistoricoDespesas = require("./routes/rotasHistoricoDespesas");

app.use("/auth", rotasUsuarios);
app.use("/items", rotasItems);
app.use("/pets", rotasPets);
app.use("/historicovet", rotasHistoricoVeterinario);
app.use("/despesas", rotasHistoricoDespesas);

app.listen(PORT, () => {
  console.log(`Servidor Express está ouvindo na porta ${PORT}`);
});
