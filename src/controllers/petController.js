const crypto = require("crypto");

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
    return res.status(500).json({ message: "Erro ao buscar pets por dono." });
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
      return res.status(404).json({ message: "Item não encontrado." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar o item por ID." });
  }
};

const createPet = async (req, res) => {
  const id_dono = req.query.id;
  const {nome, tipo_pet, raca, cor, sexo, data_nascimento } = req.body;
  const requiredFields = ['nome', 'tipo_pet', 'raca', 'cor', 'sexo', 'data_nascimento'];
  const currentDateTime = new Date().toISOString();

  if(!id_dono){
    return res.status(400).json({ message: `Id de dono é obrigatório para criar Pet.` });
  }

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.error(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`)
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  const formattedName = nome.charAt(0).toUpperCase() + nome.slice(1);

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
        [id_dono, crypto.randomUUID(), formattedName, tipo_pet, raca, sexo, currentDateTime, cor, data_nascimento]
      );
      return res
        .status(201)
        .json({ message: "Pet adicionado e vinculado com sucesso." });
    } else {
      return res
        .status(409)
        .json({ message: "ERRO 409 - Pet ja vinculado a dono!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERRO 500 - Erro ao adicionar pet." });
  }
};

const updatePet = async (req, res) => {
  const id = req.query.id;
  const { nome, tipo_pet, raca, cor, sexo, data_nascimento } = req.body;

  if (nome && tipo_pet && raca && sexo && cor && data_nascimento) {
    return res.status(400).json({ message: "Todos campos devem ser preenchidos para atualização de usuario." });
  }
  
  try {
    const updateQuery = `UPDATE pets SET nome = $1, tipo_pet = $2, raca = $3, sexo = $4, cor = $5, data_nascimento = $6 WHERE id = $7`;
    const queryValues = [nome, tipo_pet, raca, sexo, cor, data_nascimento, id];
   
    const { rows } = await req.dbClient.query(updateQuery,queryValues);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Pet não encontrado." });
    }
    return res.status(200).json({ message: "Pet atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar Pet." });
  }
};

const patchPet = async (req, res) => {
  const id = req.query.id;
  const { nome, tipo_pet, raca, cor, sexo, data_nascimento } = req.body;

  if (!nome && !tipo_pet && !raca && !cor && !sexo && !data_nascimento) {
    return res.status(400).json({ message: "Pelo menos um campo deve ser fornecido para atualização de Pet." });
  }

  try {
    const updates = [];
    const values = [];
    let placeholderCount = 1;

    if (nome) {
      updates.push(`username = $${placeholderCount}`);
      values.push(username);
      placeholderCount++;
    }
    if (tipo_pet) {
      updates.push(`tipo_pet = $${placeholderCount}`);
      values.push(tipo_pet);
      placeholderCount++;
    }
    if (raca) {
      updates.push(`raca = $${placeholderCount}`);
      values.push(raca);
      placeholderCount++;
    }
    if (cor) {
      updates.push(`cor = $${placeholderCount}`);
      values.push(cor);
      placeholderCount++;
    }
    if(sexo){
      updates.push(`sexo = $${placeholderCount}`);
      values.push(sexo);
      placeholderCount++;
    }
    if(data_nascimento) {
      updates.push(`data_nascimento = $${placeholderCount}`);
      values.push(data_nascimento);
      placeholderCount++;
    }

    values.push(id);
    placeholderCount++;

    const updateQuery = `UPDATE pets SET ${updates.join(', ')} WHERE id = $${placeholderCount}`;

    const { rows } = await req.dbClient.query(updateQuery,values);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Pet não encontrado." });
    }
    return res.status(200).json({ message: "Pet atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar Pet." });
  }
};

const deletePet = async (req, res) => {
  const id = req.query.id; 

  try {
    const result = await req.dbClient.query("DELETE FROM pets WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      console.log('pet não encontrado.');
      return res.status(404).json({ message: "pet não encontrado." });
    }
    return res.status(200).json({ message: "pet excluído com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir o pet." });
  }
};

module.exports = {
  getAllPetsByOwner,
  getPetById,
  createPet,
  updatePet,
  patchPet,
  deletePet,
};
