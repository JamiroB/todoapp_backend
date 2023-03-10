const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  let { authorization: token } = req.headers; //es lo mismo del codigo de abajo
  /* const token = req.headers.authorization; */
  token = token?.replace("Bearer ", "");
  console.log(token);
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: "HS512" },
      (err, decoded) => {
        if (err) {
          res.status(400).json({
            error: "Invalid token",
            message:
              "The token is not valid or is already expired, send a right token.",
          });
        } else {
          console.log(decoded);
          next();
        }
      }
    );
  }else{
    res.status(400).json({
      error: "No token provided",
      message: "No se esta enviando un token de autenticación"
    });
  }
};

module.exports = authMiddleware;

// Vamos a validar el token

// Si el token es valido, lo dejamos pasar a la ruta

// si es invalido, respondemos anda pasha bo
