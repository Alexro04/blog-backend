const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    // extract the token from the header
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      return res.status(400).json({
        success: false,
        message: "Access denied. Pass a valid token.",
      });

    //decode the token
    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedInfo)
      return res.status(400).json({
        success: false,
        message: "Error while verifying token",
      });

    req.userInfo = decodedInfo;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = authMiddleware;
