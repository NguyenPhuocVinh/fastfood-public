import Product from '../../db/models/Product.js';
import { StatusCodes } from 'http-status-codes';


const getProductInCategory = async (req, res) => {
    try {
        const categoryId = req.query.categoryId; 
        console.log(categoryId);
        const products = await Product.find({ categoryId: categoryId });
      res.status(StatusCodes.OK).json({ products });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

export { getProductInCategory };