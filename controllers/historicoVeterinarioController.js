const getAllHistoricoVeterinarios = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM historico_veterinario"
    );

    if (rows.length === 0) {
      res
        .status(404)
        .json({ message: "Não há Historicos Veterinarios cadastrados" });
    } else {
      res
        .status(200)
        .json({ message: "Retornado todos Historicos Veterinarios" });
      res.json(rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar itens." });
  }
};

const getHistoricoVeterinariosByIdPet = async (req, res) => {
  const id_pet = req.params.id;

  if (!id_pet) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM historico_veterinario WHERE id_pet = $1",
      [id_pet]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Histórico veterinário não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao buscar o Histórico veterinário por id_pet." });
  }
};

const createHistoricoVeterinario = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "INSERT INTO historico_veterinario (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar um Histórico veterinário." });
  }
};

const updateHistoricoVeterinario = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "UPDATE historico_veterinario SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Histórico veterinário não encontrado." });
    } else {
      res
        .status(200)
        .json({ message: "Histórico veterinário atualizado com sucesso." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar o Histórico veterinário." });
  }
};

const deleteHistoricoVeterinario = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await req.dbClient.query(
      "DELETE FROM historico_veterinario WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Histórico veterinário não encontrado." });
    }
    res.json({ message: "Histórico veterinário excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir o Histórico veterinário." });
  }
};

module.exports = {
  getAllHistoricoVeterinarios,
  getHistoricoVeterinariosByIdPet,
  createHistoricoVeterinario,
  updateHistoricoVeterinario,
  deleteHistoricoVeterinario,
};
