import { Router } from 'express';
import passport from 'passport';
import { signToken } from '../utils/jwt.js';

export const sessionsRouter = Router();

// REGISTER
sessionsRouter.post('/register', (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info?.message || 'Registro inválido' });
    const { password, ...safe } = user.toObject();
    res.status(201).json({ status: 'ok', user: safe });
  })(req, res, next);
});

// LOGIN -> set cookie httpOnly (no devolvemos el token en body)
sessionsRouter.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Credenciales inválidas' });

    const token = signToken({ uid: user._id.toString(), role: user.role, email: user.email });
    res
      .cookie('authToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,           // ponelo true en producción con HTTPS
        maxAge: 60 * 60 * 1000
      })
      .json({ status: 'ok', message: 'Login exitoso' });
  })(req, res, next);
});

// CURRENT -> usa la estrategia 'jwt' (lee cookie)
sessionsRouter.get('/current', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'No autorizado' });
    const { password, ...safe } = user;
    res.json({ status: 'ok', user: safe });
  })(req, res, next);
});

// LOGOUT -> limpiar cookie
sessionsRouter.post('/logout', (req, res) => {
  res.clearCookie('authToken', { httpOnly: true, sameSite: 'lax', secure: false });
  res.json({ status: 'ok', message: 'Logout' });
});
