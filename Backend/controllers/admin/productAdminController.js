import Product from "../../db/models/Product.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import cloudinary from "../../utils/cloudinary.js"
import multer from "multer";
import fs from "fs";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        fs.mkdirSync(uploadDir, { recursive: true }); 
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });

const uploadSingle = upload.single('image');

const createProduct = async (req, res) => {
    uploadSingle(req, res, async function (err) {
        if (err) {
            console.error(err);
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Error uploading file" });
        }

        const { productName, price, productSubtitles, feature, description, categoryId } = req.body;
        const { path: imagePath } = req.file; 

        try {
            if (!productName || !price || !productSubtitles || !feature || !categoryId || !imagePath) {
                throw new BadRequestError("Please provide all required fields and ensure departureDate is a valid date");
            }

            const uploadedResponse = await cloudinary.uploader.upload(imagePath, {
                folder: "food-images",
            });

            if (!uploadedResponse || !uploadedResponse.url) {
                throw new InternalServerError("Failed to upload image to Cloudinary");
            }

            const product = new Product({
                productName,
                price,
                productSubtitles,
                feature,
                imagePath: uploadedResponse.url,
                categoryId
            });

            const savedProduct = await product.save();

            res.status(StatusCodes.CREATED).json({ savedProduct });
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    });
};

const updateProduct = async (req, res) => {
    const { _id } = req.params;
    const updateFields = req.body;

    try {
        const product = await Product.findOneAndUpdate({ _id }, updateFields, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            throw new NotFoundError(`Product with id ${_id} not found`);
        }

        res.status(StatusCodes.OK).json({ product });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid data provided" });
    }
};

const deleteProduct = async (req, res) => {
    const { _id } = req.params;

    try {
        const product = await Product.findByIdAndDelete({ _id });

        if (!product) {
            throw new NotFoundError(`Product with id ${_id} not found`);
        }

        res.status(StatusCodes.OK).json({ product });
    } catch (error) {
        console.error(error);
        throw new BadRequestError("Invalid data");
    }
};

const getAllProducts = async (req, res) => {
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

export { createProduct, updateProduct, deleteProduct, getAllProducts };
