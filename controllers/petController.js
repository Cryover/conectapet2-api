const { Pool } = require("pg");
const pool = new Pool();

const getAllPets = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM pets");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar itens." });
  }
};

const createPet = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO pets (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar um pet." });
  }
};

const updatePet = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE pets SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "pet não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar o pet." });
  }
};

const deletePet = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query("DELETE FROM pets WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "pet não encontrado." });
    }
    res.json({ message: "pet excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir o pet." });
  }
};

module.exports = {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
};
