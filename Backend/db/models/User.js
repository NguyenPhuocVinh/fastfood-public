import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        maxlength: 50,
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Please provide phone number"],
        validate: {
            validator: function(value) {
                return /^0[0-9]{9}$/.test(value);
            },
            message: "Invalid phone number format. Please enter a valid Vietnamese phone number."
        }
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
        select: false
    },
    address: {
        type: String
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "guest"]
    },
    resetToken: String,
    resetTokenExpiration: Date,
})

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.createJWT = function() {
    return jwt.sign(
        {userId: this._id, role: this.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    )
}

userSchema.methods.comparePassword = async function(candidatePassword) {
    const isPasswordCorrect = await bcrypt.compare(candidatePassword, this.password);
    return isPasswordCorrect;
}

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetTokenExpiration = Date.now() + 30 * 60 * 1000;
    await this.save();
    return resetToken;
};

export default mongoose.model("User", userSchema);