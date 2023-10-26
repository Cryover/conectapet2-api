const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.header("Authorization"); // Assuming the token is sent in the "Authorization" header

  if (!token) {
    return res.status(401).json({ error: "Não autorizado, favor fazer Login" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }

    // If the token is valid, you can access the user's information in `decoded`.
    // You can also attach the user information to the request object for later use.
    req.user = decoded;
    next();
  });
};

module.exports = requireAuth;
