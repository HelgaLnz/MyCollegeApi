require('dotenv').config();

const jwt = require('jsonwebtoken');

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: 10
  });
  const refreshToken = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: 60 * 60 * 15,
  });

  return { accessToken: accessToken, refreshToken: refreshToken };
};

const refreshTokens = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  return generateTokens(decoded.id);
};

module.exports = {
  generateTokens,
  refreshTokens,
};