import { User } from '../models/user.js';
import { emailServices } from '../services/mail.services.js';
import { v4 as uuidv4 } from 'uuid';
import { userService } from '../services/user.services.js';

import { jwtService } from '../services/jwt.service.js';
const register = async (req, res) => {
  const { email, password } = req.body;
  const activationToken =  uuidv4()
  const newUser = await User.create({ email, password ,activationToken});

await emailServices.sendActivationEmail(email,activationToken)
  res.send(newUser);



};

const activate = async (req, res) => {
  const{ activationToken} = req.params
  const user = await User.findOne({ where: { activationToken } })
  if (!user) {
    res.sendStatus(404)
    return
  }
  user.activationToken = null
  user.save()
  res.send(user)
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user =  await userService.findByEmail(email);
  if (!user || user.password !== password) {
    res.send(401);
    return

  }
  const normalizeUser = userService.normalize(user)
  const accessToken = jwtService.sign(normalizeUser)
  res.send({
    user: normalizeUser,
    accessToken
  })
}

export const authController = {
  register,
  activate,
  login
};
