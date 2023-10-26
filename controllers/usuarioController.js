const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const pool = new Pool();

const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res) => {
  const { username, password } = req.body;
  const { users } = await pool.query("SELECT * FROM items WHERE id = $1", [id]);

  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Usuário ou Senha inválido" });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
};

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

const getAllUsuarios = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar itens." });
  }
};

const getUsuarioById = async (req, res) => {
  const id = req.params.id;

  try {
    const { rows } = await pool.query("SELECT * FROM items WHERE id = $1", [
      id,
    ]);
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
  let { username, email, nome, senha } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username é obrigatório." });
  }
  if (!senha) {
    return res.status(400).json({ error: "Senha é obrigatória." });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM usuarios");

    if (!rows) {
      const hashedPassword = await bcrypt.hash(req.body.senha, 10);
      user = new User({
        username: req.body.username,
        email: req.body.email,
        senha: hashedPassword,
      });

      const { savedUser } = await pool.query(
        "INSERT INTO usuarios (username, email, nome, senha) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, email, nome, senha]
      );
      res
        .status(201)
        .json({ message: `Usuario ${savedUser} criado com sucesso` });
    } else {
      console.error(error);
      res.status(403).json("Usuário já existente");
    }

    //const savedUser = await user.save();
    //res.json(savedUser);
  } catch (e) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar um usuario." });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO usuarios (name) VALUES ($1) RETURNING *",
      [user]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
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
    const { rows } = await pool.query(
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
    const result = await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
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
  login,
  verifyToken,
};
