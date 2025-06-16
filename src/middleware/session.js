// middlewares/auth.js
function requireHandle(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

module.exports = { requireHandle };
