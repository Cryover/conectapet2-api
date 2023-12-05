const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { TiposUsuario } = require('../utils/enums.js');

const getAllUsuarios = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query("SELECT * FROM usuarios");
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar itens." });
  } finally {
    //req.dbDone();
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
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar o Usuario por ID." });
  }
};

const createUsuario = async (req, res) => {
  const { username, email, nome, password } = req.body;
  const requiredFields = ['username', 'email', 'password'];
  const currentDateTime = new Date().toISOString();
  const tipoUsuario = TiposUsuario.PADRAO;

  console.log(currentDateTime)
  console.log(new Date().toISOString())
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  try {
    const { rows } = await req.dbClient.query("SELECT * FROM usuarios WHERE username = $1 OR email = $2",[username, email]);

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { savedUser } = await req.dbClient.query(
        "INSERT INTO usuarios (id, username, email, nome, password, tipo_usuario, criado_em) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          crypto.randomUUID(),
          username.toLowerCase(),
          email,
          nome ? nome.toLowerCase() : undefined,
          hashedPassword,
          tipoUsuario,
          currentDateTime
        ]
      );
      return res
        .status(201)
        .json({ error: `ERRO 201 - Usuario ${username} criado com sucesso` });
    } else {
      //console.error(error);
      return res.status(409).json("Usuário já cadastrado com esse email ou nome de usuario");
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao criar um usuario." });
  }
};

const updateUsuario = async (req, res) => {
  const id = req.query.id;
  const { username, email, nome, password, tipo_usuario, criado_em } = req.body;

  if (!username && !email && !nome && !password && !criado_em) {
    return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização de usuario." });
  }

  try {
    const updates = [];
    const values = [];

    if (username) {
      updates.push("username = $1");
      values.push(username);
    }
    if (email) {
      updates.push("email = $2");
      values.push(email);
    }
    if (nome) {
      updates.push("nome = $3");
      values.push(nome);
    }
    if (password) {
      updates.push("password = $4");
      values.push(password);
    }
    if(id === process.env.ID_ADMIN){
      if (tipo_usuario) {
        updates.push("tipo_usuario = $5");
        values.push(tipo_usuario);
      }
    }
    if (criado_em) {
      if(id === process.env.ID_ADMIN){
        updates.push("criado_em = $6");
      }else {
        updates.push("criado_em = $5");
      }

      values.push(criado_em);
    }

    const updateQuery = `UPDATE despesa SET ${updates.join(', ')} WHERE id = $7`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryValues = [username, email, nome, hashedPassword, tipo_usuario, criado_em, id];

    const { rows } = await req.dbClient.query(updateQuery, queryValues);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario não encontrado." });
    }
    return res.status(200).json({ message: "Usuario atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar o usuario." });
  }
};

const deleteUsuario = async (req, res) => {
  const id = req.query.id;

  try {
    const result = await req.dbClient.query(
      "DELETE FROM usuarios WHERE id = $1",
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
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
