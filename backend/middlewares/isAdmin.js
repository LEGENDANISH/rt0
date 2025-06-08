module.exports = (req, res, next) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!req.user || req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};