const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: "Autenticação necessária" });
  }

  const tokenParts = authorizationHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ error: "Formato do Token errado" });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Token is valid
    //console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    // Token verification failed
    if (
      err.name === "JsonWebTokenError" &&
      err.message === "invalid signature"
    ) {
      // Handle JWT signature error
      res.status(401).json({ error: "Invalid token" });
    } else {
      // Handle other errors

      if (
        err.name === "JsonWebTokenError" &&
        err.message === "invalid signature"
      ) {
        // Handle JWT signature error
        return res.status(401).json({ error: "Invalid token" });
      } else {
        // Handle other errors
        return res
          .status(401)
          .json({ error: "Acesso Negado ou Token expirado" });
      }
    }
  }
};

module.exports = requireAuth;
