import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../../errors/index.js';

import Product from '../../db/models/Product.js';
import Category from "../../db/models/Category.js";

const getSingleProduct = async (req, res) => {
    const { _id } = req.params;
    console.log(_id);
    
    const product = await Product.findById(_id);
    
    if (!product) {
        throw new NotFoundError(`No product with id ${_id}`);
    }

    console.log(product.imagePath);
    res.status(StatusCodes.OK).json({ product });
};

const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find({}).populate('categoryId', 'categoryName');
        console.log(products.length);
        if (!products || products.length === 0) {
            throw new NotFoundError(`No products`);
        }

        const productsWithCategoryName = products.map(product => ({
            _id: product._id,
            productName: product.productName,
            price: product.price,
            productSubtitles: product.productSubtitles,
            feature: product.feature,
            imagePath: product.imagePath,
            categoryName: product.categoryId.categoryName 
        }));

        res.status(StatusCodes.OK).json({ products: productsWithCategoryName });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};

const searchProduct = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        const { keyword } = req.query;

        if (!keyword || isNaN(page) || page < 1) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid parameters' });
        }

        const products = await Product.find({ address: { $regex: new RegExp(keyword, 'i') } })
            .skip((page - 1) * 8)
            .limit(8);

        if (!products || products.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'No tours found' });
        }

        res.status(StatusCodes.OK).json({products});
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

const getFeaturedProduct = async (req, res) => {
    const products = await Product.find({ feature: true }).limit(8);
    console.log(products.length);
    if (!products || products.length === 0) {
        throw new NotFoundError(`No featured product`);
    }
    res.status(StatusCodes.OK).json({ products });
};

const getProductCount = async (req, res) => {
    try{
        const productCount = await Product.estimatedDocumentCount();
        res.status(StatusCodes.OK).json({ productCount });
    }catch(error){
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


export { getSingleProduct, getAllProduct, searchProduct, getFeaturedProduct, getProductCount };
