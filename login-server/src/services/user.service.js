import { ApiError } from '../exeptions/api.error.js';
import { User } from '../models/user.js';
import { emailService } from '../services/email.service.js';
import { v4 as uuidv4 } from 'uuid';

export function getAllActivated() {
  return User.findAll({
    where: { activationToken: null },
  });
}

function normalize({ name, id, email }) {
  return { name, id, email };
}

function findByEmail(email) {
  return User.findOne({ where: { email } });
}

async function register(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();

  const existUser = await User.findOne({ where: { email: normalizedEmail } });

  if (existUser) {
    throw ApiError.badRequest('User already exist', {
      email: 'User already exist',
    });
  }

  const activationToken = uuidv4();

  const newUser = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password,
    activationToken,
  });

  try {
    await emailService.sendActivationEmail(
      normalizedName,
      normalizedEmail,
      activationToken,
    );
  } catch (err) {
    console.error('[email] Failed to send activation email:', err.message);
  }

  return userService.normalize(newUser);
}

export const userService = {
  getAllActivated,
  normalize,
  findByEmail,
  register,
};
