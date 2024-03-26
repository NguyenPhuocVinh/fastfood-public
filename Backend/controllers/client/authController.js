import User from "../../db/models/User.js";
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../../errors/index.js';
import {sendEmail} from '../../utils/sendEmail.js';
import crypto from 'crypto';

const createTokenResponse = (user) => ({
    user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
    },
    token: user.createJWT(),
});

const registerUser = async (req, res) => {
    const { fullName, email, password, phone, role } = req.body;

    if (!email || !password || !phone) {
        throw new BadRequestError("Please fill in all fields");
    }

    let userToUpdate = await User.findOne({ email });

    if (!userToUpdate) {
        const newUser = await User.create({ fullName, email, password, phone, role });
        const response = createTokenResponse(newUser);
        res.status(StatusCodes.CREATED).json(response);
    } else if (userToUpdate && userToUpdate.role === 'guest') {
        userToUpdate.role = 'user';
        await userToUpdate.save();

        const response = createTokenResponse(userToUpdate);
        res.status(StatusCodes.CREATED).json(response);
    } else {
        throw new BadRequestError(`User with email ${email} already exists.`);
    }
};


const loginUser = async (req, res) => {
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
};

const updateUser = async (req, res) => {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
        throw new BadRequestError("Please fill in all fields");
    }

    const user = await User.findOne({ _id: req.user.userId });

    user.fullName = fullName;
    user.email = email;
    user.phone = phone;

    await user.save();

    const response = createTokenResponse(user);

    res.status(StatusCodes.OK).json(response);
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            throw new BadRequestError(`User with email ${email} not found.`);
        }

        // Call the instance method to create a reset token
        const resetToken = await user.createPasswordResetToken();

        // Use the reset token to create the reset URL
        const resetURL = `http://nguyenphuocvinh.me/reset-password/${resetToken}`;

        // Send the email with the correct recipient's email address
        await sendEmail(user.email, 'Your password reset token', null, `Click <a href="${resetURL}">here</a> to reset your password.`);

        res.status(StatusCodes.OK).json({ message: 'Reset link sent to email' });
    } catch (error) {
        console.error(error);
        throw new Error('There was an error sending the email. Try again later!');
    }
};




const resetPassword = async (req, res) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

        if (!user) {
            throw new BadRequestError('Invalid or expired reset token');
        }

        user.password = req.body.password;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new BadRequestError("Please fill in all fields");
    }

    const user = await User.findOne({ _id: req.user.userId }).select("+password");

    if (currentPassword === newPassword) {
        throw new BadRequestError("New password cannot be the same as the old password");
    }

    else{
        const isPasswordCorrect = await user.comparePassword(currentPassword);

        if (!isPasswordCorrect) {
            throw new UnAuthenticatedError("Wrong password");
        }

        user.password = newPassword;
        await user.save();

        res.status(StatusCodes.OK).json({ message: "Password updated successfully" });
    }

    

}


export { registerUser, loginUser, updateUser, forgotPassword, resetPassword, changePassword };
