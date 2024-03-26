import User from "../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../../errors/index.js";

const logginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please fill in all fields");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new UnAuthenticatedError("Wrong Email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError("Wrong Email or password");
    }

    const response = createTokenResponse(user);

    res.status(StatusCodes.OK).json(response);
}
const deleteUser = async (req, res) => {
    const { _id } = req.params;

    try {
        const user = await User.findByIdAndDelete(_id);

        if (!user) {
            throw new NotFoundError(`User with id ${_id} not found`);
        }

        res.status(StatusCodes.OK).json({ user });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};

const createTokenResponse = (user) => ({
    user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
    },
    token: user.createJWT(),
});

export {deleteUser, logginAdmin};
