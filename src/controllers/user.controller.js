
import { userService } from '../services/user.services.js';

const getAllActivated = async (req, res) => {
  const user = await userService.getAllActivated()
  res.send(user.map(userService.normalize))
}

export const userController = {
  getAllActivated
};
