const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "ERRO 401 - Autenticação necessária" });
  }

  const tokenParts = authorizationHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "ERRO 401 - Formato do Token invalido" });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Token is valid
    //console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    // Token verification failed
    if (
      err.name === "JsonWebTokenError" &&
      err.message === "invalid signature"
    ) {
      // Handle JWT signature error
      return res.status(401).json({ message: "ERRO 401 - Token Invalido" });
    } else {
      // Handle other errors

      if (
        err.name === "JsonWebTokenError" &&
        err.message === "invalid signature"
      ) {
        // Handle JWT signature error
        return res.status(401).json({ message: "ERRO 401 - Token Invalido" });
      } else {
        // Handle other errors
        return res
          .status(401)
          .json({ message: "ERRO 401 - Acesso Negado ou Token expirado" });
      }
    }
  }
};

module.exports = requireAuth;
