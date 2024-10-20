import httpStatus from 'http-status';
import { tokenService, userService } from '../../services';
import catchAsync from '../../utils/catchAsync';
import exclude from '../../utils/exclude';

const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.createUser(email, password);
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user: userWithoutPassword, tokens });
});

export default {
  register,
};
