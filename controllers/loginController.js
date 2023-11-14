const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username é obrigatório." });
  }
  if (!password) {
    return res.status(400).json({ error: "Senha é obrigatória." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM usuarios WHERE username = $1 OR email = $1",
      [username]
    );

    if (rows.length === 0 || rows === undefined) {
      console.log('rows vazio');
      return res.status(404).json({ error: "Usuario não existe." });
    } else {
      const user = rows[0];
      console.log('encontrou usuario!');
      if (bcrypt.compareSync(password, user.password)) {
        // User is authenticated; generate a JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        const response = {
          userToken: token,
          usuario: rows[0]
        };

        res.json(response);
      } else {
        // Authentication failed
        return res.status(401).json({ error: "Usuário ou password inválidos" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro 500 - Erro interno do servidor" });
  }
};

const verifyToken = (req, res) => {
  const { token } = req.body;
  //const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  //console.log('token', token)
  if (!token) {
    return res.status(401).json({ message: 'Erro 401 - Token nao informado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Erro 401 - Token expirado' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Erro 401 - Token invalido' });
      } else {
        return res.status(401).json({ message: 'Erro 401 - Verificacao de token falhou' });
      }
    }

    return res.status(200).json({ message: 'Status 200 - Token Validado!' });
  });
};

module.exports = {
  login,
  verifyToken
};
