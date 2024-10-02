import jwt from 'jsonwebtoken';

const authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // 401 means unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, userId) => {
    if (err) return res.sendStatus(403); // 403 means forbidden
    req.userId = userId;
    next();
  });
}

export default authToken;