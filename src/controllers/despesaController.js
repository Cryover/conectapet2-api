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
      "SELECT * FROM despesas WHERE id_dono = $1",
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
      .json({ message: "Erro ao buscar despesas por id_dono." });
  }
};

const getAllDespesaByDay = async (req, res) => {
  const id_dono = req.params.id;
  const day = req.query.day;

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
      .json({ message: "Erro ao buscar despesas por id_dono." });
  }
};

const getAllDespesaByMonth = async (req, res) => {
  const id_dono = req.params.id;
  const month = req.query.month;

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
        .json({ message: `Nenhuma despesa encontrada no mês de ${month}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar despesas por id_dono." });
  }
};

const getAllDespesaByYear = async (req, res) => {
  const id_dono = req.params.id;
  const year = req.query.year;

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
      .json({ message: "Erro ao buscar despesas por id_dono." });
  }
};

const createDespesa = async (req, res) => {
  const id_dono = req.query.donoId;
  const id_pet = req.query.petId;
  const { nome, descricao, data, observacao } = req.body;
  const requiredFields = ['nome', 'valor', 'data', 'observacao'];
  const currentDateTime = new Date().toISOString();

  if (!id_dono) {
    return res.status(400).json({ message: `Id de dono é obrigatório.` });
  }

  if (!id_pet) {
    return res.status(400).json({ message: `Id de pet é obrigatório.` });
  }

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.error(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`)
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  try {
    const { rows } = await req.dbClient.query(
      "INSERT INTO compromisso (id, id_nome, id_pet, nome, descricao, data, observacao, criado_em) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        crypto.randomUUID(),
        id_dono,
        id_pet,
        nome,
        descricao,
        data,
        observacao,
        currentDateTime
      ]
    );
    return res.status(201).json({ message: "Despesa criada com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar Compromisso." });
  }
};

const updateDespesa = async (req, res) => {
  const id_dono = req.query.id;
  const { id_pet, nome, descricao, data, observacao } = req.body;

  if (id_pet || !nome || !descricao || !data || !observacao) {
    return res.status(400).json({ message: "Todos campos devem ser fornecidos para atualização de despesa." });
  }

  try {
    const updateQuery = `UPDATE despesa SET id_pet = $1, nome = $2, descricao = $3, data = $4, observacao = $5 WHERE id = $6`;
    const queryValues = [id_pet, nome, descricao, data, observacao, id_dono];

    const { rows } = await req.dbClient.query(updateQuery, queryValues);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario não encontrado." });
    }
    return res.status(200).json({ message: "Usuario atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar o usuario." });
  }
};

const patchDespesa = async (req, res) => {
  const id_dono = req.query.id;
  const { id_pet, nome, descricao, data, observacao } = req.body;
  let hashedPassword;

  if (id_pet && !nome && !descricao && !data && !observacao) {
    return res.status(400).json({ message: "Pelo menos um campo deve ser fornecido para atualização de despesa." });
  }

  try {
    const updates = [];
    const values = [];
    let placeholderCount = 1;

    if (username) {
      updates.push(`username = $${placeholderCount}`);
      values.push(username);
      placeholderCount++;
    }
    if (email) {
      updates.push(`email = $${placeholderCount}`);
      values.push(email);
      placeholderCount++;
    }
    if (nome) {
      updates.push(`nome = $${placeholderCount}`);
      values.push(nome);
      placeholderCount++;
    }
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${placeholderCount}`);
      values.push(hashedPassword);
      placeholderCount++;
    }
    if (id === process.env.ID_ADMIN) {
      if (tipo_usuario) {
        updates.push(`tipo_usuario = $${placeholderCount}`);
        values.push(tipo_usuario);
        placeholderCount++;
      }
    }
    if (criado_em) {
      if (id === process.env.ID_ADMIN) {
        updates.push(`criado_em = $${placeholderCount}`);
      } else {
        updates.push(`criado_em = $${placeholderCount}`);
      }
      values.push(criado_em);
      placeholderCount++;
    }

    values.push(id_dono);
    placeholderCount++;

    const updateQuery = `UPDATE despesa SET ${updates.join(', ')} WHERE id = $${placeholderCount}`;

    const { rows } = await req.dbClient.query(updateQuery, values);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario não encontrado." });
    }
    return res.status(200).json({ message: "Usuario atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar o usuario." });
  }
};

const deleteDespesa = async (req, res) => {
  const id = req.query.id;

  try {
    const result = await req.dbClient.query(
      "DELETE FROM despesa WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario não encontrado." });
    }
    return res.status(200).json({ message: "Usuario excluído com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir o usuario." });
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
