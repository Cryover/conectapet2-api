const { Pool } = require("pg");
const pool = new Pool();

const getAllPets = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM pets");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pets." });
  }
};

const getAllPetsByOwner = async (req, res) => {
  const id_dono = req.params.id;

  try {
    const { rows } = await pool.query("SELECT * FROM pets WHERE id_dono = $1", [
      id_dono,
    ]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pets por dono." });
  }
};

const getPetById = async (req, res) => {
  const id = req.params.id;

  try {
    const { rows } = await pool.query("SELECT * FROM pets WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Item não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar o item por ID." });
  }
};

const createPet = async (req, res) => {
  const { id_dono, nome, tipo_pet, raca, sexo } = req.body;

  if (!id_dono) {
    return res.status(400).json({ error: "id de dono é obrigatório." });
  }
  if (!nome) {
    return res.status(400).json({ error: "Nome de pet é obrigatório." });
  }
  if (!tipo_pet) {
    return res.status(400).json({ error: "Tipo de pet é obrigatório." });
  }
  if (!raca) {
    return res.status(400).json({ error: "Raça de pet é obrigatório." });
  }
  if (!sexo) {
    return res.status(400).json({ error: "Sexo de pet é obrigatório." });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM pets WHERE id_dono = $1", [
      id_dono,
    ]);

    if (!rows) {
      const { savedPet } = await pool.query(
        "INSERT INTO pets (id_dono) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [id_dono, nome, tipo_pet, raca, sexo]
      );
      console.log(savedPet[0]);
      res
        .status(201)
        .json({ message: "Pet adicionado e vinculado a dono com sucesso." });
    } else {
      res
        .status(409)
        .json({ message: "Pet adicionado e vinculado a dono com sucesso." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar pet." });
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
  getAllPetsByOwner,
  getPetById,
  getAllPets,
  createPet,
  updatePet,
  deletePet,
};
