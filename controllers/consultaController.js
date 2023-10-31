const getAllConsulta = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM consulta"
    );

    if (rows.length === 0) {
      res
        .status(404)
        .json({ message: "Não há Historicos Veterinarios cadastrados" });
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

const getConsultaByIdPet = async (req, res) => {
  const id_pet = req.params.id;

  if (!id_pet) {
    return res.status(400).json({ error: "Id_pet é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM consulta WHERE id_pet = $1",
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

const createConsulta = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "INSERT INTO consulta (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar um Histórico veterinário." });
  }
};

const updateConsulta = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "UPDATE consulta SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Consulta não encontrada." });
    } else {
      res
        .status(200)
        .json({ message: "Consulta atualizada com sucesso." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar Consulta." });
  }
};

const deleteConsulta = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await req.dbClient.query(
      "DELETE FROM consulta WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Consulta não encontrada." });
    }
    res.json({ message: "Consulta excluída com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir Consulta." });
  }
};

module.exports = {
  getAllConsulta,
  getConsultaByIdPet,
  createConsulta,
  updateConsulta,
  deleteConsulta,
};
