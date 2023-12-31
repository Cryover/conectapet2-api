const crypto = require("crypto");

const getAllCompromissoByIdPet = async (req, res) => {
  const id_pet = req.params.id;

  if (!id_pet) {
    return res.status(400).json({ message: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_pet = $1",
      [id_pet]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Histórico veterinário não encontrado." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar o Histórico veterinário por id_pet." });
  } finally {
    req.dbDone();
  }
};

const getAllCompromissoByIdOwner = async (req, res) => {
  const id_dono = req.params.id;

  if (!id_dono) {
    return res.status(400).json({ message: "Id_dono é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_dono = $1",
      [id_dono]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum compromisso encontrado." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar compromissos por id_dono." });
  } finally {
    req.dbDone();
  }
};

const getAllCompromissoByDay = async (req, res) => {
  const id_dono = req.params.id;
  const day = req.params.day;

  if (!id_dono) {
    return res.status(400).json({ message: "Id_dono é obrigatório." });
  }

  if (!day) {
    return res.status(400).json({ message: "Dia é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_dono = $1 AND EXTRACT(DAY FROM data) = $2",
      [id_dono, day]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Nenhum compromisso encontrado em ${day}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar compromissos por id_dono." });
  } finally {
    req.dbDone();
  }
};

const getAllCompromissoByMonth = async (req, res) => {
  const id_dono = req.params.id;
  const month = req.params.month;

  if (!id_dono) {
    return res.status(400).json({ message: "Id_dono é obrigatório." });
  }

  if (!month) {
    return res.status(400).json({ message: "Mês é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_dono = $1 AND EXTRACT(MONTH FROM data) = $2",
      [id_dono, month]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Nenhum compromisso encontrado em ${month}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar compromissos por Mês." });
  } finally {
    req.dbDone();
  }
};

const getAllCompromissoByYear = async (req, res) => {
  const id_dono = req.params.id;
  const year = req.params.year;

  if (!id_dono) {
    return res.status(400).json({ message: "Id_dono é obrigatório." });
  }

  if (!year) {
    return res.status(400).json({ message: "Ano é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_dono = $1 AND EXTRACT(YEAR FROM data) = $2",
      [id_dono, year]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Nenhum compromisso encontrado em ${year}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar compromissos por id_dono." });
  } finally {
    req.dbDone();
  }
};

const createCompromisso = async (req, res) => {
  const id_dono = req.query.id;
  const { ids_pets, nome, descricao, data, hora, tipo_compromisso } = req.body;
  const requiredFields = ['ids_pets', 'nome', 'descricao', 'data', 'tipo_compromisso'];
  const currentDateTime = new Date().toLocaleDateString();
  let newData;

  if(!id_dono){
    return res.status(400).json({ message: `Id de dono é obrigatório.` });
  }

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.error(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`)
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  const combineDateAndTime = (dateStr, timeStr) => {
    const combinedStr = `${dateStr}T${timeStr}`;
    return new Date(combinedStr);
  }

  if(data && hora) {
    newData = combineDateAndTime(data, hora);
  } else {
    if(data){
      newData = data;
    }
    if(hora){
      newData = hora;
    }
  }

  try {
    await req.dbClient.query(
      "INSERT INTO compromisso (id, id_pets, nome, descricao, data, tipo_compromisso, id_dono, criado_em) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [
        crypto.randomUUID(),
        ids_pets,
        nome,
        descricao,
        newData,
        tipo_compromisso,
        id_dono,
        currentDateTime
      ]
    );
    return res.status(201).json({ message: `Compromisso adicionado com sucesso` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar Compromisso." });
  } finally {
    req.dbDone();
  }
};

const updateCompromisso = async (req, res) => {
  const id = req.query.id;
  const { ids_pets, nome, descricao, data, hora, tipo_compromisso } = req.body;
  const requiredFields = ['ids_pets', 'nome', 'descricao', 'data', 'hora', 'tipo_compromisso'];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.error(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`)
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  const combineDateAndTime = (dateStr, timeStr) => {
    const combinedStr = `${dateStr}T${timeStr}`;
    return new Date(combinedStr);
  }
  
  try {
    const combinedDatetime = combineDateAndTime(data, hora);
    const updateQuery = `UPDATE compromisso SET ids_pets = $1, nome = $2, descricao = $3, data = $4, tipo_compromisso = $5 WHERE id = $6`;
    const queryValues = [ids_pets, nome, descricao, combinedDatetime, tipo_compromisso, id];
   
    const { rows } = await req.dbClient.query(updateQuery,queryValues);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario não encontrado." });
    }
    return res.status(200).json({ message: "Usuario atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar o usuario." });
  } finally {
    req.dbDone();
  }
};

const patchCompromisso = async (req, res) => {
  const id = req.query.id;
  const { ids_pets, nome, descricao, data, hora, tipo_compromisso } = req.body;

  if (!ids_pets && !nome && !descricao && !data & !hora && !tipo_compromisso) {
    return res.status(400).json({ message: "Pelo menos um campo deve ser fornecido para atualizar compromisso." });
  }

  const combineDateAndTime = (dateStr, timeStr) => {
    const combinedStr = `${dateStr}T${timeStr}`;
    return new Date(combinedStr);
  }

  try {
    const updates = [];
    const values = [];
    let placeholderCount = 1;

    if (ids_pets) {
      updates.push(`ids_pets = $${placeholderCount}`);
      values.push(ids_pets);
      placeholderCount++;
    }
    if (nome) {
      updates.push(`nome = $${placeholderCount}`);
      values.push(nome);
      placeholderCount++;
    }
    if (descricao) {
      updates.push(`descricao = $${placeholderCount}`);
      values.push(descricao);
      placeholderCount++;
    }
    if(tipo_compromisso){
      updates.push(`tipo_compromisso = $${placeholderCount}`);
      values.push(tipo_compromisso);
      placeholderCount++;
    }

    if(data && hora){
      const combinedDatetime = combineDateAndTime(data, hora);
      updates.push(`data = $${placeholderCount}`);
      values.push(combinedDatetime);
      placeholderCount++;
    } else {
      if (data) {
        updates.push(`data = $${placeholderCount}`);
        values.push(data);
        placeholderCount++;
      }
      if(hora){
        updates.push(`data = $${placeholderCount}`);
        values.push(data);
        placeholderCount++;
      }
    }

    values.push(id);

    const updateQuery = `UPDATE compromisso SET ${updates.join(', ')} WHERE id = $${placeholderCount}`;

    const { rows } = await req.dbClient.query(updateQuery,values);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Compromisso não encontrado." });
    }
    return res.status(200).json({ message: "Compromisso atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar compromisso." });
  } finally {
    req.dbDone();
  }
};

const deleteCompromisso = async (req, res) => {
  const id = req.query.id;

  try {
    await req.dbClient.query(
      "DELETE FROM compromisso WHERE id = $1",
      [id]
    );
    return res.status(200).json({ message: "Compromisso excluída com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir Compromisso." });
  } finally {
    req.dbDone();
  }
};

module.exports = {
  getAllCompromissoByIdPet,
  getAllCompromissoByIdOwner,
  getAllCompromissoByDay,
  getAllCompromissoByMonth,
  getAllCompromissoByYear,
  createCompromisso,
  updateCompromisso,
  patchCompromisso,
  deleteCompromisso,
};
