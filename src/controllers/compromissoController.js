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
      res
        .status(200)
        .json({ message: "Retornado todos Historicos Veterinarios" });
      res.json(rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar itens." });
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
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
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
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao buscar compromissos por id_dono." });
  }
};

const createCompromisso = async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "INSERT INTO compromisso (nome) VALUES ($1) RETURNING *",
      [nome]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar Compromisso." });
  }
};

const updateCompromisso = async (req, res) => {
  const id = req.params.id;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "UPDATE compromisso SET nome = $1 WHERE id = $2 RETURNING *",
      [nome, id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Compromisso não encontrada." });
    } else {
      res
        .status(200)
        .json({ message: "Compromisso atualizada com sucesso." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar Compromisso." });
  }
};

const deleteCompromisso = async (req, res) => {
  const id = req.params.id;

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
    res.json({ message: "Compromisso excluída com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir Compromisso." });
  }
};

module.exports = {
  getAllCompromisso,
  getAllCompromissoByIdPet,
  getAllCompromissoByIdOwner,
  createCompromisso,
  updateCompromisso,
  deleteCompromisso,
};
