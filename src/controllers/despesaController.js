const crypto = require("crypto");

const getAllDespesaByIdPet = async (req, res) => {
  const id_pet = req.params.id;

  if (!id_pet) {
    return res.status(400).json({ message: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa WHERE id_pet = $1",
      [id_pet]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Histórico despesa não encontrado." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar o Histórico despesa por id_pet." });
  }
};

const getAllDespesaByIdOwner = async (req, res) => {
  const id_dono = req.params.id;

  if (!id_dono) {
    return res.status(400).json({ message: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa WHERE id_dono = $1",
      [id_dono]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma despesa encontrada." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar despesa por id_dono." });
  }
};

const getAllDespesaByDay = async (req, res) => {
  const id_dono = req.params.id;
  const day = req.params.day;

  if (!id_dono) {
    return res.status(400).json({ message: "Id_pet é obrigatório." });
  }

  if (!day) {
    return res.status(400).json({ message: "Dia é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa WHERE id_dono = $1 AND EXTRACT(DAY FROM data) = $2",
      [id_dono, day]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Nenhuma despesa encontrada no dia ${day}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar despesa por id_dono." });
  }
};

const getAllDespesaByMonth = async (req, res) => {
  const id_dono = req.params.id;
  const month = req.params.month;

  if (!id_dono) {
    return res.status(400).json({ message: "Id_pet é obrigatório." });
  }

  if (!month) {
    return res.status(400).json({ message: "Mês é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa WHERE id_dono = $1 AND EXTRACT(MONTH FROM data) = $2",
      [id_dono, month]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Nenhuma despesa encontrada no mês ${month}.` });
    }
    console.log(rows[0]);
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar despesa por id_dono." });
  }
};

const getAllDespesaByYear = async (req, res) => {
  const id_dono = req.params.id;
  const year = req.params.year;

  if (!id_dono) {
    return res.status(400).json({ message: "Id_pet é obrigatório." });
  }

  if (!year) {
    return res.status(400).json({ message: "Ano é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa WHERE id_dono = $1 AND EXTRACT(YEAR FROM data) = $2",
      [id_dono, year]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Nenhuma despesa encontrada em ${year}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar despesa por id_dono." });
  }
};

const createDespesa = async (req, res) => {
  const id_dono = req.query.id;
  const { id_pet, nome, valor, data, hora, observacao } = req.body;
  const requiredFields = ['id_pet', 'nome', 'valor', 'data', 'observacao'];
  const currentDateTime = new Date().toISOString();
  let newData;

  if (!id_dono) {
    return res.status(400).json({ message: `Id de dono é obrigatório.` });
  }

  if (!id_pet) {
    return res.status(400).json({ message: `Id de pet é obrigatório.` });
  }

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.log(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`)
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  const combineDateAndTime = (dateStr, timeStr) => {
    const combinedStr = `${dateStr}T${timeStr}`;
    return new Date(combinedStr);
  }

  if(data && hora) {
    newData = combineDateAndTime(data, hora);
    console.log(newData)
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
      "INSERT INTO despesa (id, id_dono, id_pet, nome, valor, observacao, data, criado_em) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        crypto.randomUUID(),
        id_dono,
        id_pet,
        nome,
        valor,
        observacao,
        newData,
        currentDateTime
      ]
    );
    return res.status(201).json({ message: "Despesa criada com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar Despesa." });
  }
};

const updateDespesa = async (req, res) => {
  const id = req.query.id;
  const { id_pet, nome, data, hora, observacao } = req.body;
  const requiredFields = ['id_pet', 'nome', 'data', 'hora', 'observacao'];

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
    const updateQuery = `UPDATE despesa SET id_pet = $1, nome = $2, data = $3, observacao = $4 WHERE id = $5`;
    const queryValues = [id_pet, nome, combinedDatetime, observacao, id];

    await req.dbClient.query(updateQuery, queryValues);
    return res.status(200).json({ message: "Despesa atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar despesa." });
  }
};

const patchDespesa = async (req, res) => {
  const id_dono = req.query.id;
  const { id_pet, nome, data, hora, observacao } = req.body;

  if (id_pet && !nome && !data & !hora && !observacao) {
    return res.status(400).json({ message: "Pelo menos um campo deve ser fornecido para atualização de despesa." });
  }

  const combineDateAndTime = (dateStr, timeStr) => {
    const combinedStr = `${dateStr}T${timeStr}`;
    return new Date(combinedStr);
  }

  try {
    const updates = [];
    const values = [];
    let placeholderCount = 1;

    if (id_pet) {
      updates.push(`id_pet = $${placeholderCount}`);
      values.push(email);
      placeholderCount++;
    }
    if (nome) {
      updates.push(`nome = $${placeholderCount}`);
      values.push(nome);
      placeholderCount++;
    }

    if (observacao) {
      updates.push(`observacao = $${placeholderCount}`);
      values.push(observacao);
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
        updates.push(`data = date_trunc('day', ${hora}) + $${placeholderCount}::time`);
        values.push(hora);
        placeholderCount++;
      }
    }

    values.push(id_dono);

    const updateQuery = `UPDATE despesa SET ${updates.join(', ')} WHERE id = $${placeholderCount}`;

    await req.dbClient.query(updateQuery, values);
    return res.status(200).json({ message: "Despesa atualizada com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar o despesa." });
  }
};

const deleteDespesa = async (req, res) => {
  const id = req.query.id;

  try {
    await req.dbClient.query(
      "DELETE FROM despesa WHERE id = $1",
      [id]
    );
    return res.status(200).json({ message: "Despesa excluído com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao excluir o Despesa." });
  }
};

module.exports = {
  getAllDespesaByIdPet,
  getAllDespesaByIdOwner,
  getAllDespesaByDay,
  getAllDespesaByMonth,
  getAllDespesaByYear,
  createDespesa,
  updateDespesa,
  patchDespesa,
  deleteDespesa,
};
