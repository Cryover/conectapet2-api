const crypto = require("crypto");

const getAllCompromisso = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso"
    );

    if (rows.length === 0) {
      res
        .status(404)
        .json({ message: "Não há Compromissos cadastrados" });
    } else {
      return res
        .status(200)
        .json(rows);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar itens." });
  }
};

const getAllCompromissoByIdPet = async (req, res) => {
  const id_pet = req.params.id;

  if (!id_pet) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_pet = $1",
      [id_pet]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Histórico veterinário não encontrado." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar o Histórico veterinário por id_pet." });
  }
};

const getAllCompromissoByIdOwner = async (req, res) => {
  const id_dono = req.params.id;

  if (!id_dono) {
    return res.status(400).json({ error: "Id_dono é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_dono = $1",
      [id_dono]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhum compromisso encontrado." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar compromissos por id_dono." });
  }
};

const getAllCompromissoByDay = async (req, res) => {
  const id_dono = req.params.id;
  const day = req.query.day;

  if (!id_dono) {
    return res.status(400).json({ error: "Id_dono é obrigatório." });
  }

  if (!day) {
    return res.status(400).json({ error: "Dia é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_dono = $1 AND EXTRACT(DAY FROM data) = $2",
      [id_dono, day]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Nenhum compromisso encontrado em ${day}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar compromissos por id_dono." });
  }
};

const getAllCompromissoByMonth = async (req, res) => {
  const id_dono = req.params.id;
  const month = req.query.month;

  if (!id_dono) {
    return res.status(400).json({ error: "Id_dono é obrigatório." });
  }

  if (!month) {
    return res.status(400).json({ error: "Mês é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_dono = $1 AND EXTRACT(MONTH FROM data) = $2",
      [id_dono, month]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Nenhum compromisso encontrado em ${month}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar compromissos por Mês." });
  }
};

const getAllCompromissoByYear = async (req, res) => {
  const id_dono = req.params.id;
  const year = req.query.year;

  if (!id_dono) {
    return res.status(400).json({ error: "Id_dono é obrigatório." });
  }

  if (!year) {
    return res.status(400).json({ error: "Ano é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM compromisso WHERE id_dono = $1 AND EXTRACT(YEAR FROM data) = $2",
      [id_dono, year]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Nenhum compromisso encontrado em ${year}.` });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar compromissos por id_dono." });
  }
};

const createCompromisso = async (req, res) => {
  const id_dono = req.query.id;
  const { ids_pets, nome, descricao, data, tipo_compromisso } = req.body;
  const requiredFields = ['ids_pets', 'nome', 'descricao', 'data', 'tipo_compromisso'];

  if(!id_dono){
    return res.status(400).json({ error: `Id de dono é obrigatório.` });
  }

  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.error(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`)
      return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  try {
    const { rows } = await req.dbClient.query(
      "INSERT INTO compromisso (id, id_pets, nome, descricao, data, tipo_compromisso, id_dono) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [
        crypto.randomUUID(),
        ids_pets,
        nome,
        descricao,
        data,
        tipo_compromisso,
        id_dono,
      ]
    );
    return res.status(201).json(`Compromisso adicionado com sucesso`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar Compromisso." });
  }
};

const updateCompromisso = async (req, res) => {
  const id = req.query.id;
  const { nome, descricao, data, tipo_compromisso } = req.body;

  if (!nome && !descricao && !data && !tipo_compromisso) {
    return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização de compromisso." });
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
    if (tipo_compromisso) {
      updates.push("tipo_compromisso = $4");
      values.push(tipo_compromisso);
    }

    const updateQuery = `UPDATE compromisso SET ${updates.join(', ')} WHERE id = $1`;

    const { rows } = await req.dbClient.query(updateQuery, id);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Despesa não encontrada." });
    }

    return res.status(200).json({ message: "Compromisso atualizada com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar Compromisso." });
  }
};


const deleteCompromisso = async (req, res) => {
  const id = req.query.id;

  try {
    const result = await req.dbClient.query(
      "DELETE FROM compromisso WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Compromisso não encontrada." });
    }
    return res.status(200).json({ message: "Compromisso excluída com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao excluir Compromisso." });
  }
};

module.exports = {
  getAllCompromisso,
  getAllCompromissoByIdPet,
  getAllCompromissoByIdOwner,
  getAllCompromissoByDay,
  getAllCompromissoByMonth,
  getAllCompromissoByYear,
  createCompromisso,
  updateCompromisso,
  deleteCompromisso,
};
