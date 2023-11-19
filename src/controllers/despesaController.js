const getAllDespesa = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar despesas." });
  }
};

const getAllDespesaByIdPet = async (req, res) => {
  const id_pet = req.params.id;

  if (!id_pet) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesas WHERE id_pet = $1",
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

const getAllDespesaByIdOwner = async (req, res) => {
  const id_dono = req.params.id;

  if (!id_dono) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesas WHERE id_dono = $1",
      [id_dono]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhuma despesa encontrada." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao buscar despesas por id_dono." });
  }
};

const createDespesa = async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "INSERT INTO despesa (nome) VALUES ($1) RETURNING *",
      [nome]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar um usuario." });
  }
};

const updateDespesa = async (req, res) => {
  const id = req.params.id;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "UPDATE despesa SET nome = $1 WHERE id = $2 RETURNING *",
      [nome, id]
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

const deleteDespesa = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await req.dbClient.query(
      "DELETE FROM despesa WHERE id = $1",
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
  getAllDespesa,
  getAllDespesaByIdPet,
  getAllDespesaByIdOwner,
  createDespesa,
  updateDespesa,
  deleteDespesa,
};
