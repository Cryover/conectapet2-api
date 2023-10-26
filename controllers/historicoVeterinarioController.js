const { Pool } = require("pg");
const pool = new Pool();

const getAllHistoricoVeterinarios = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM historico_vet");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar itens." });
  }
};

const createHistoricoVeterinario = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO historico_vet (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar um historico veterinario." });
  }
};

const updateHistoricoVeterinario = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE historico_vet SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "historico veterinario não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar o historico veterinario." });
  }
};

const deleteHistoricoVeterinario = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query("DELETE FROM historico_vet WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "historico veterinario não encontrado." });
    }
    res.json({ message: "historico veterinario excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir o historico veterinario." });
  }
};

module.exports = {
  getAllHistoricoVeterinarios,
  createHistoricoVeterinario,
  updateHistoricoVeterinario,
  deleteHistoricoVeterinario,
};
