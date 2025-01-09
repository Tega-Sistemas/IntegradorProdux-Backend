import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const SECRET_KEY = process.env.JWT_SECRET;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Access Denied. No Token Provided.'});
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or Expired Token',
    });
  }
}