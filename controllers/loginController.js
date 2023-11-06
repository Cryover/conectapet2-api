const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res) => {
  const { username, senha } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username é obrigatório." });
  }
  if (!senha) {
    return res.status(400).json({ error: "Senha é obrigatório." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM usuarios WHERE username = $1 OR email = $1",
      [username]
    );
    const user = rows[0];
    console.log(rows[0]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario não existe." });
    } else {
      if (bcrypt.compareSync(senha, user.senha)) {
        // User is authenticated; generate a JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        // Authentication failed
        return res.status(401).json({ error: "Usuário ou Senha inválidos" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro 500 - Erro interno do servidor" });
  }
};

module.exports = {
  login,
};
