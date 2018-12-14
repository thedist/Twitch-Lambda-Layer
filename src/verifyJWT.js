const jwt = require('jsonwebtoken');

module.exports = (token, secret) => {
  const bearerPrefix = 'Bearer ';
  if (!token) throw new Error('Missing JWT Token');
  if (!secret) throw new Error('Missing JWT Secret');
  if (!token.startsWith(bearerPrefix)) throw new Error('Invalid token prefix');

  try {
    return jwt.verify(token.substring(bearerPrefix.length), Buffer.from(secret, 'base64'), { algorithms: ['HS256'] });
  } catch (err) {
    throw err
  }
};