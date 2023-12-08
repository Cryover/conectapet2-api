const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res) => {
  const { username, password } = req.body;

  //console.log(username)

  if (!username) {
    return res.status(400).json({ message: "Username é obrigatório." });
  }
  if (!password) {
    return res.status(400).json({ message: "Senha é obrigatória." });
  }

  try {
    const { rows } = await req.dbClient.query(
      "SELECT * FROM usuarios WHERE username = $1 OR email = $1",
      [username]
    );

    if (rows.length === 0 || rows === undefined) {
      //console.log('rows vazio');
      return res.status(404).json({ message: "Usuario não cadastrado." });
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
        console.log('Response', response)
        return res.status(200).json(response);
      } else {
        // Authentication failed
        return res.status(401).json({ message: "Usuário ou senha inválido." });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro 500 - Erro interno do servidor" });
  } finally {
    req.dbDone();
  }
};

const verifyToken = (req, res) => {
  let token = req.headers.authorization;
  console.log('Verificando Token', token)
  
  if (!token) {
    //console.log('token undefined')
    return res.status(401).json({ message: 'Erro 401 - Token nao informado' });
  }else {
    token = req.headers.authorization.split(' ')[1];
    //console.log('new token', token)
  }

  try {
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
      console.log('Token Validado');
      return res.status(200).json({ message: 'Status 200 - Token Validado!' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao verificar Token" });
  } finally {
    req.dbDone();
  }
};

module.exports = {
  login,
  verifyToken
};
