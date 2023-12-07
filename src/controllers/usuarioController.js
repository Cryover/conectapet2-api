const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { TiposUsuario } = require('../utils/enums.js');

const getAllUsuarios = async (req, res) => {
  try {
    const { rows } = await req.dbClient.query("SELECT * FROM usuarios");
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar itens." });
  } finally {
    //req.dbDone();
  }
};

const getUsuarioById = async (req, res) => {
  const id = req.query.id;

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM items WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario não encontrado." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar o Usuario por ID." });
  }
};

const createUsuario = async (req, res) => {
  const { username, email, nome, password } = req.body;
  const requiredFields = ['username', 'email', 'password'];
  const currentDateTime = new Date().toISOString();
  const tipoUsuario = TiposUsuario.PADRAO;
  let formattedName;

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.` });
    }
  }

  try {
    const { rows } = await req.dbClient.query("SELECT * FROM usuarios WHERE username = $1 OR email = $2",[username, email]);
    if(nome){
      formattedName = nome.charAt(0).toUpperCase() + nome.slice(1);
    }

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { savedUser } = await req.dbClient.query(
        "INSERT INTO usuarios (id, username, email, nome, password, tipo_usuario, criado_em) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          crypto.randomUUID(),
          username.toLowerCase(),
          email,
          formattedName ? formattedName : undefined,
          hashedPassword,
          tipoUsuario,
          currentDateTime
        ]
      );
      return res
        .status(201)
        .json({ message: `ERRO 201 - Usuario ${username} criado com sucesso` });
    } else {
      return res.status(409).json("Usuário já cadastrado com esse email ou nome de usuario");
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Erro ao criar um usuario." });
  }
};

const updateUsuario = async (req, res) => {
  const id = req.query.id;
  const { username, email, nome, password, tipo_usuario } = req.body;
  let updateQuery;
  let queryValues;

  if(id === process.env.ID_ADMIN){
    if (!username || !email || !nome && !password && !tipo_usuario) {
      return res.status(400).json({ message: "Todos campos devem ser fornecidos para atualização de usuario." });
    }
  } else {
    if (!username || !email || !nome || !password) {
      return res.status(400).json({ message: "Todos campos devem ser fornecidos para atualização de usuario." });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    if(id === process.env.ID_ADMIN){
      updateQuery = `UPDATE despesa SET username = $1, email = $2, nome = $3, password = $4, tipo_usuario = $5 WHERE id = $6`;
      queryValues = [username, email, nome, hashedPassword, tipo_usuario, id]
    }else {
      updateQuery = `UPDATE despesa SET username = $1, email = $2, nome = $3, password = $4 WHERE id = $5`;
      queryValues = [username, email, nome, hashedPassword, id]
    }
   
    const { rows } = await req.dbClient.query(updateQuery,queryValues);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario não encontrado." });
    }
    return res.status(200).json({ message: "Usuario atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar o usuario." });
  }
};

const patchUsuario = async (req, res) => {
  const id = req.query.id;
  const { username, email, nome, password, tipo_usuario } = req.body;
  let hashedPassword;

  if (!username && !email && !nome && !password) {
    return res.status(400).json({ message: "Pelo menos um campo deve ser fornecido para atualização de usuario." });
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
    if(id === process.env.ID_ADMIN){
      if (tipo_usuario) {
        updates.push(`tipo_usuario = $${placeholderCount}`);
        values.push(tipo_usuario);
        placeholderCount++;
      }
    }

    values.push(id);
    placeholderCount++;

    const updateQuery = `UPDATE despesa SET ${updates.join(', ')} WHERE id = $${placeholderCount}`;

    const { rows } = await req.dbClient.query(updateQuery,values);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario não encontrado." });
    }
    return res.status(200).json({ message: "Usuario atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar o usuario." });
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
      return res.status(404).json({ message: "Usuario não encontrado." });
    }
    return res.status(200).json({ message: "Usuario excluído com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir o usuario." });
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  patchUsuario,
  deleteUsuario,
};
