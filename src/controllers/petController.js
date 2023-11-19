const crypto = require("crypto");
const moment = require('moment');

const getAllPets = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query("SELECT * FROM pets");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pets." });
  }
};

const getAllPetsByOwner = async (req, res) => {
  const id_dono = req.params.id;

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM pets WHERE id_dono = $1",
      [id_dono]
    );
    //console.error(rows)
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pets por dono." });
  }
};

const getPetById = async (req, res) => {
  const id = req.params.id;

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM pets WHERE id = $1",
      [id]
    );
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
  const id_dono = req.params.id;
  const {nome, tipo_pet, raca, cor, sexo, data_nascimento } = req.body;
  const requiredFields = ['nome', 'tipo_pet', 'raca', 'cor', 'sexo', 'data_nascimento'];
  const currentDateTime = moment().format('DD/MM/YYYY HH:mm:ss');

  if(!id_dono){
    return res.status(400).json({ error: `Id de dono é obrigatório.` });
  }

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.error(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`)
      return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  //console.log('id_dono', id_dono)

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM pets WHERE id_dono = $1 AND nome = $2",
      [id_dono, nome]
    );

    console.log(rows)

    if (rows.length === 0) {

      const { savedPet } = await req.dbClient.query(
        "INSERT INTO pets (id_dono, id, nome, tipo_pet, raca, sexo, criado_em, cor, data_nascimento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [id_dono, crypto.randomUUID(), nome, tipo_pet, raca, sexo, currentDateTime, cor, data_nascimento]
      );
      res
        .status(201)
        .json({ message: "Pet adicionado e vinculado com sucesso." });
    } else {
      res
        .status(409)
        .json({ error: "ERRO 409 - Pet ja vinculado a dono!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ERRO 500 - Erro ao adicionar pet." });
  }
};

const updatePet = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
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
    const result = await req.dbClient.query("DELETE FROM pets WHERE id = $1", [
      id,
    ]);
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
