import { StatusCodes } from "http-status-codes";
import OrderDetail from "../../db/models/orderDetail.js";

const getOrders = async (req, res) => {
    try {
        const ordersWithDetails = await OrderDetail.find().populate({
            path: 'orderId',
            select: 'fullName email phone address totalAmount paymentStatus paymentMethod createAt'
        }).populate({
            path: 'products.productId', 
            select: 'productName price quantity' 
        });

        const orders = ordersWithDetails.map(orderDetail => {
            const order = orderDetail.orderId;
            const products = orderDetail.products.map(product => ({
                name: product.productId.productName, 
                price: product.price,
                quantity: product.quantity
            }));
            return {
                id: order._id,
                fullName: order.fullName,
                email: order.email,
                phone: order.phone,
                address: order.address,
                createAt: order.createAt,
                PaymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                totalAmount: order.totalAmount,
                products
            };
        });

        res.status(StatusCodes.OK).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export default getOrders;
