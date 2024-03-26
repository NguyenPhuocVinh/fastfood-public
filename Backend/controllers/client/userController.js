import User from "../../db/models/User.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../../errors/index.js";
import orderDetail from "../../db/models/orderDetail.js";

const getLogin = async (req, res) => {
    const userId = req.user.userId;

    if (!userId) {
        throw new ForbiddenError("Access denied. You are not logged in.");
    }

    try {
        const user = await User.findById(userId, 'fullName email phone');

        if (!user) {
            throw new NotFoundError("User not found");
        }

        res.status(StatusCodes.OK).json({ user });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const getHistoryOrder = async (req, res) => {
    const userId = req.user.userId;

    try {
        const ordersWithDetails = await orderDetail.find({}).populate({
            path: 'orderId',
            match: { userId }, 
            select: 'fullName email phone address totalAmount paymentStatus'
        }).populate({
            path: 'products.productId',
            select: 'productName price' 
        });

        if (!ordersWithDetails || ordersWithDetails.length === 0) {
            throw new NotFoundError("No orders found");
        }

        // Filter out orders without orderId (no matching userId)
        const filteredOrders = ordersWithDetails.filter(orderDetail => orderDetail.orderId);

        // Map the filtered orders to the desired format
        const history = filteredOrders.map(orderDetail => ({
            id: orderDetail.orderId._id,
            fullName: orderDetail.orderId.fullName,
            email: orderDetail.orderId.email,
            phone: orderDetail.orderId.phone,
            address: orderDetail.orderId.address,
            totalAmount: orderDetail.orderId.totalAmount,
            paymentStatus: orderDetail.orderId.paymentStatus,
            products: orderDetail.products.map(product => ({
                name: product.productId ? product.productId.productName : "Product not found", // Check if productId exists
                price: product.price
            }))
        }));

        res.status(StatusCodes.OK).json({ orders: history });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


export {getLogin, getHistoryOrder};