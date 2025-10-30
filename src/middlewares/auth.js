import passport from 'passport';

export const requireAuth = passport.authenticate('jwt', { session: false });

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  if (req.user.role !== role) return res.status(403).json({ error: 'No autorizado' });
  next();
};
