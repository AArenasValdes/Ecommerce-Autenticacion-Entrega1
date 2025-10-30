import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

export function createHash(plain) {
  return bcrypt.hashSync(plain, SALT_ROUNDS);   // consigna pide hashSync
}

export function isValidPassword(plain, hashed) {
  return bcrypt.compareSync(plain, hashed);
}
