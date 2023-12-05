const crypto = require("crypto");

const getAllDespesa = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa"
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar despesas." });
  }
};

const getAllDespesaByIdPet = async (req, res) => {
  const id_pet = req.params.id;

  if (!id_pet) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesas WHERE id_pet = $1",
      [id_pet]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Histórico despesa não encontrado." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar o Histórico despesa por id_pet." });
  }
};

const getAllDespesaByIdOwner = async (req, res) => {
  const id_dono = req.params.id;

  if (!id_dono) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesas WHERE id_dono = $1",
      [id_dono]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhuma despesa encontrada." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar despesas por id_dono." });
  }
};

const getAllDespesaByDay = async (req, res) => {
  const id_dono = req.params.id;
  const day = req.query.day;

  if (!id_dono) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  if (!day) {
    return res.status(400).json({ error: "Dia é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa WHERE id_dono = $1 AND EXTRACT(DAY FROM data) = $2",
      [id_dono, day]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Nenhuma despesa encontrada no dia ${day}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar despesas por id_dono." });
  }
};

const getAllDespesaByMonth = async (req, res) => {
  const id_dono = req.params.id;
  const month = req.query.month;

  if (!id_dono) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  if (!month) {
    return res.status(400).json({ error: "Mês é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa WHERE id_dono = $1 AND EXTRACT(MONTH FROM data) = $2",
      [id_dono, month]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Nenhuma despesa encontrada no mês de ${month}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar despesas por id_dono." });
  }
};

const getAllDespesaByYear = async (req, res) => {
  const id_dono = req.params.id;
  const year = req.query.year;

  if (!id_dono) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  if (!year) {
    return res.status(400).json({ error: "Ano é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM despesa WHERE id_dono = $1 AND EXTRACT(YEAR FROM data) = $2",
      [id_dono, year]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Nenhuma despesa encontrada em ${year}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar despesas por id_dono." });
  }
};

const createDespesa = async (req, res) => {
  const id_dono = req.query.donoId;
  const id_pet = req.query.petId;
  const { nome, descricao, data, observacao } = req.body;
  const requiredFields = ['nome', 'valor', 'data', 'observacao'];

  if(!id_dono){
    return res.status(400).json({ error: `Id de dono é obrigatório.` });
  }

  if(!id_pet){
    return res.status(400).json({ error: `Id de pet é obrigatório.` });
  }

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.error(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`)
      return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  try {
    const { rows } = await req.dbClient.query(
      "INSERT INTO compromisso (id, id_nome, id_pet, nome, descricao, data, observacao) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [
        crypto.randomUUID(),
        id_dono,
        id_pet,
        nome,
        descricao,
        data,
        observacao,
      ]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar Compromisso." });
  }
};

const updateDespesa = async (req, res) => {
  const id = req.query.id;
  const { nome, descricao, data, observacao } = req.body;

  if (!nome && !descricao && !data && !observacao) {
    return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização de despesa." });
  }

  try {
    const updates = [];
    const values = [];

    if (nome) {
      updates.push("nome = $1");
      values.push(nome);
    }
    if (descricao) {
      updates.push("descricao = $2");
      values.push(descricao);
    }
    if (data) {
      updates.push("data = $3");
      values.push(data);
    }
    if (observacao) {
      updates.push("observacao = $4");
      values.push(observacao);
    }

    const updateQuery = `UPDATE despesa SET ${updates.join(', ')} WHERE id = $5`;
    const queryValues = [nome, descricao, data, observacao, id];

    const { rows } = await req.dbClient.query(updateQuery, queryValues);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }

    return res.status(200).json({ message: "Despesa atualizada com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar a despesa." });
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
      return res.status(404).json({ error: "Usuario não encontrado." });
    }
    return res.status(200).json({ message: "Usuario excluído com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao excluir o usuario." });
  }
};

module.exports = {
  getAllDespesa,
  getAllDespesaByIdPet,
  getAllDespesaByIdOwner,
  getAllDespesaByDay,
  getAllDespesaByMonth,
  getAllDespesaByYear,
  createDespesa,
  updateDespesa,
  deleteDespesa,
};
