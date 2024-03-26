import mongoose from "mongoose";
import validator from "validator";

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        required: [true, "Please provide your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        validate: {
            validator: validator.isEmail, 
            message: "Please provide a valid email"
        },
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
    address: {
        type: String,
        required: [true, "Please provide address"]
    },

    totalAmount: {
        type: Number,
        required: [true, "Please provide total amount"],
        validate: {
            validator: function (value) {
                return Number.isInteger(value);
            },
            message: "Total amount must be a positive integer"
        }
    },

    paymentMethod: {
        type: String,
        required: [true, "Please provide payment method"],
        enum: ["COD", "Online"]
    },

    paymentStatus: {
        type: String,
        default: "Chờ thanh toán",
        enum: ["Đã thanh toán", "Chờ thanh toán", "Từ chối thanh toán"]
    },

    createAt: {
        type: Date,
        default: Date.now()
    }
    
})

export default mongoose.model("Order", orderSchema);