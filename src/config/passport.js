import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { UserModel } from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

// ---- Local: register ----
passport.use('register', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', passReqToCallback: true, session: false },
  async (req, email, password, done) => {
    try {
      const exists = await UserModel.findOne({ email });
      if (exists) return done(null, false, { message: 'Email ya registrado' });

      const { first_name, last_name, age, cart, role } = req.body;
      const user = await UserModel.create({
        first_name, last_name, email, age,
        cart: cart ?? null,
        role: role ?? 'user',
        password: createHash(password)
      });
      return done(null, user);
    } catch (err) { return done(err); }
  }
));

// ---- Local: login ----
passport.use('login', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', session: false },
  async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return done(null, false, { message: 'Credenciales inválidas' });
      const ok = isValidPassword(password, user.password);
      if (!ok) return done(null, false, { message: 'Credenciales inválidas' });
      return done(null, user);
    } catch (err) { return done(err); }
  }
));

// ---- JWT: extrae desde cookie httpOnly ----
const cookieExtractor = (req) => {
  if (req && req.cookies) return req.cookies.authToken || null;
  return null;
};

passport.use('jwt', new JwtStrategy(
  { jwtFromRequest: cookieExtractor, secretOrKey: process.env.JWT_SECRET },
  async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.uid).lean();
      if (!user) return done(null, false, { message: 'No autorizado' });
      return done(null, user);
    } catch (err) { return done(err, false); }
  }
));

export default passport;
