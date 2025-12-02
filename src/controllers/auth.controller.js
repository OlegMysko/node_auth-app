import { User } from '../models/user.js';

import { userService } from '../services/user.services.js';

import { jwtService } from '../services/jwt.service.js';
import { ApiError } from '../exeptions/api.error.js';


function validateEmail(value) {
  const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!value){ return 'Email is required'};
  if (!EMAIL_PATTERN.test(value)) {return 'Email is not valid'};
}

const validatePassword = (value) => {
  if (!value) {return 'Password is required';}
  if (value.length < 6) {return 'At least 6 characters'};
};

const register = async (req, res,next) => {
  const { email, password } = req.body;
  const  errors = {
  email: validateEmail(email),
  password:validatePassword(password)
}
if (errors.email || errors.password) {
  throw ApiError.badRequest('Bad request', errors)
}

 await userService.register(email,password)
  res.send({message:'OK'});
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

  if (!user || user.password !== password) {
    res.send(401);

    return;
  }

  const normalizeUser = userService.normalize(user);
  const accessToken = jwtService.sign(normalizeUser);

  res.send({
    user: normalizeUser,
    accessToken,
  });
};

export const authController = {
  register,
  activate,
  login,
};
