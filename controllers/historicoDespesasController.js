const getAllHistoricoDespesas = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM historico_Despesa"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar itens." });
  }
};

const getHistoricoDespesasByIdPet = async (req, res) => {
  const id_pet = req.params.id;

  if (!id_pet) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM historico_despesas WHERE id_pet = $1",
      [id_pet]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Histórico despesa não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao buscar o Histórico despesa por id_pet." });
  }
};

const createHistoricoDespesa = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "INSERT INTO historico_Despesa (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar um usuario." });
  }
};

const updateHistoricoDespesa = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "UPDATE historico_Despesa SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "usuario não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar o usuario." });
  }
};

const deleteHistoricoDespesa = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await req.dbClient.query(
      "DELETE FROM historico_Despesa WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "usuario não encontrado." });
    }
    res.json({ message: "usuario excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir o usuario." });
  }
};

module.exports = {
  getAllHistoricoDespesas,
  getHistoricoDespesasByIdPet,
  createHistoricoDespesa,
  updateHistoricoDespesa,
  deleteHistoricoDespesa,
};
