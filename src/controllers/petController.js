const crypto = require("crypto");

const getAllPets = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query("SELECT * FROM pets");
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar pets." });
  }
};

const getAllPetsByOwner = async (req, res) => {
  const id_dono = req.query.id;

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM pets WHERE id_dono = $1",
      [id_dono]
    );
    //console.error(rows)
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar pets por dono." });
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
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar o item por ID." });
  }
};

const createPet = async (req, res) => {
  const id_dono = req.query.id;
  const {nome, tipo_pet, raca, cor, sexo, data_nascimento } = req.body;
  const requiredFields = ['nome', 'tipo_pet', 'raca', 'cor', 'sexo', 'data_nascimento'];
  const currentDateTime = new Date().toISOString();

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
      return res
        .status(201)
        .json({ message: "Pet adicionado e vinculado com sucesso." });
    } else {
      return res
        .status(409)
        .json({ error: "ERRO 409 - Pet ja vinculado a dono!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ERRO 500 - Erro ao adicionar pet." });
  }
};

const updatePet = async (req, res) => {
  const id = req.query.id;
  const { nome, tipo_pet, raca, sexo, criado_em, cor, data_nascimento } = req.body;

  if (!nome && !tipo_pet && !raca && !sexo && !criado_em && !cor && !data_nascimento) {
    return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização de pet." });
  }

  try {
    const updates = [];
    const values = [];

    if (nome) {
      updates.push("nome = $1");
      values.push(nome);
    }
    if (tipo_pet) {
      updates.push("tipo_pet = $2");
      values.push(tipo_pet);
    }
    if (raca) {
      updates.push("raca = $3");
      values.push(raca);
    }
    if (sexo) {
      updates.push("sexo = $4");
      values.push(sexo);
    }
    if (criado_em) {
      updates.push("criado_em = $5");
      values.push(criado_em);
    }
    if (cor) {
      updates.push("cor = $6");
      values.push(cor);
    }
    if (data_nascimento) {
      updates.push("data_nascimento = $7");
      values.push(data_nascimento);
    }

    const updateQuery = `UPDATE pets SET ${updates.join(', ')} WHERE id = $8`;
    const queryValues = [nome, tipo_pet, raca, sexo, criado_em, cor, data_nascimento, id];
    const { rows } = await req.dbClient.query(updateQuery, queryValues);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Pet não encontrado." });
    }

    return res.status(200).json({ message: "Pet atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar o pet." });
  }
};

const deletePet = async (req, res) => {
  const id = req.query.id; 

  try {
    const result = await req.dbClient.query("DELETE FROM pets WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "pet não encontrado." });
    }
    return res.status(200).json({ message: "pet excluído com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao excluir o pet." });
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
