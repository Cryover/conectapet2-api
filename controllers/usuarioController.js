const bcrypt = require("bcrypt");
const crypto = require("crypto");
const moment = require('moment');

const getAllUsuarios = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query("SELECT * FROM usuarios");
    res.json(rows);
    res.status(200).json({ error: "Operação bem-sucedida." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar itens." });
  }
};

const getUsuarioById = async (req, res) => {
  const id = req.params.id;

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM items WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar o Usuario por ID." });
  }
};

const createUsuario = async (req, res) => {
  const { username, email, nome, senha } = req.body;
  const currentDateTime = moment().format('DD/MM/YYYY HH:mm:ss');

  console.log(currentDateTime)

  if (!username) {
    return res.status(400).json({ error: "Username é obrigatório." });
  }
  if (!email) {
    return res.status(400).json({ error: "Email é obrigatório." });
  }
  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatória." });
  }
  if (!senha) {
    return res.status(400).json({ error: "Senha é obrigatória." });
  }

  try {
    const { rows } = await req.dbClient.query("SELECT * FROM usuarios");

    if (!rows.length !== 0) {
      const hashedPassword = await bcrypt.hash(req.body.senha, 10);
      

      const { savedUser } = await req.dbClient.query(
        "INSERT INTO usuarios (id, username, email, nome, senha, tipo_usuario, criado_em) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          crypto.randomUUID(),
          username,
          email,
          nome.toLowerCase(),
          hashedPassword,
          "padrao",
          currentDateTime
        ]
      );
      res
        .status(201)
        .json({ message: `Usuario ${username} criado com sucesso` });
    } else {
      console.error(error);
      res.status(409).json("Usuário já existente");
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao criar um usuario." });
  }
};

const updateUsuario = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "UPDATE usuarios SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "usuario não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar o usuario." });
  }
};

const deleteUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await req.dbClient.query(
      "DELETE FROM usuarios WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "usuario não encontrado." });
    }
    res.json({ message: "usuario excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir o usuario." });
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
