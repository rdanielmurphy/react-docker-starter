import bcrypt from 'bcrypt';

export const BCRYPT_SALT_ROUNDS = 12;

export function saltAndHashPassword(plaintextPassword) {
    return bcrypt.hash(plaintextPassword, BCRYPT_SALT_ROUNDS);
}

export function comparePasswords(plaintextPassword, saltAndHashPassword) {
    return bcrypt.compare(plaintextPassword, saltAndHashPassword);
}