import { User } from '../models/user.js';

import { userService } from '../services/user.services.js';

import { jwtService } from '../services/jwt.service.js';
import { ApiError } from '../exeptions/api.error.js';
import bcrypt from 'bcrypt';

function validateEmail(value) {
  const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!value) {
    return 'Email is required';
  }

  if (!EMAIL_PATTERN.test(value)) {
    return 'Email is not valid';
  }
}

const validatePassword = (value) => {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'At least 6 characters';
  }
};

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email || errors.password) {
    throw ApiError.badRequest('Bad request', errors);
  }

  const hashedPass = await bcrypt.hash(password,10)
  await userService.register(email, hashedPass);
  res.send({ message: 'OK' });
};

const activate = async (req, res) => {
  const { activationToken } = req.params;
  const user = await User.findOne({ where: { activationToken } });

  if (!user) {
    res.sendStatus(404);

    return;
  }
  user.activationToken = null;
  user.save();
  res.send(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.findByEmail(email);

  if (!user ) {
    throw ApiError.badRequest('No such user')
  }
  const isPasswordValid = await bcrypt.compare(password,user.password)
  if (!isPasswordValid) {
    throw ApiError.badRequest('Wrong password')
  }
  generateTokens(res, user)

};

const refresh = (req, res) => {
  const { refreshToken } = req.cookies;
  const user = jwtService.verifyRefresh(refreshToken)
  if (!user) {
    throw ApiError.unauthorized()
  }
  generateTokens(res, user)
}

const generateTokens = (res, user) => {

  const normalizeUser = userService.normalize(user);
  const accessToken = jwtService.sign(normalizeUser);
  const refreshToken = jwtService.signRefresh(normalizeUser)
  res.cookie('refreshToken', refreshToken, {
    maxAge:30*24*60*60*1000,
    httpOnly: true
})
  res.send({
    user: normalizeUser,
    accessToken,
  });

}
export const authController = {
  register,
  activate,
  login,refresh
};
