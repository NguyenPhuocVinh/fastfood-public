import mongoose from "mongoose";

const paySchema = mongoose.Schema({
    orderIdVNP: {
        type: String,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    amountTranstion: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now()
    },
    createAtt: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("Pay", paySchema);
