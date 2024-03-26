import mongoose from "mongoose";

const orderDetailSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true
            },
            price: {
                type: Number,
                required: [true, "Please provide price"],
                validate: {
                    validator: function (value) {
                        return Number.isInteger(value) && value > 0;
                    },
                    message: "Price must be a positive integer"
                }
            },
            quantity: {
                type: Number,
                required: [true, "Please provide quantity"],
                validate: {
                    validator: function (value) {
                        return Number.isInteger(value) && value > 0;
                    },
                    message: "Quantity must be a positive integer"
                }
            }
        }
    ]
});

export default mongoose.model("OrderDetail", orderDetailSchema);
