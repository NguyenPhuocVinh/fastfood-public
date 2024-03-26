import User from "../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../../errors/index.js";
import orderDetail from "../../db/models/orderDetail.js";
import Order from "../../db/models/Order.js";

const getLogin = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    throw new ForbiddenError("Access denied. You are not logged in.");
  }

  try {
    const user = await User.findById(userId, "fullName email phone");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};


const getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export { getLogin, getAllUser};
