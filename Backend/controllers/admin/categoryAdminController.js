import Category from '../../db/models/Category.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../../errors/index.js'
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

const createCategory = async (req, res) => {
    uploadSingle(req, res, async function (err) {
        if (err) {
            console.error(err);
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Error uploading file" });
        }

        const { categoryName } = req.body;
        const { path: imagePath } = req.file; 
        console.log(req.file);
        try {
            if (!categoryName || !imagePath) {
                throw new BadRequestError("Please provide all required fields and ensure departureDate is a valid date");
            }

            const uploadedResponse = await cloudinary.uploader.upload(imagePath, {
                folder: "food-images",
            });

            if (!uploadedResponse || !uploadedResponse.url) {
                throw new InternalServerError("Failed to upload image to Cloudinary");
            }

            const category = new Category({
                categoryName,
                imagePath: uploadedResponse.url
            });

            const categorySaved = await category.save();

            res.status(StatusCodes.CREATED).json({ categorySaved });
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    });
};



const updateCategory = async (req, res) => {
    const { _id } = req.params;
    const updateFields = req.body;

    try {
        const category = await Category.findOneAndUpdate({ _id }, updateFields, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            throw new NotFoundError(`Category with id ${_id} not found`);
        }

        res.status(StatusCodes.OK).json({ category });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid data provided" });
    }
};

const deleteCategory = async (req, res) => {
    const { _id } = req.params;

    try {
        const category = await Category.findByIdAndDelete({ _id });

        if (!category) {
            throw new NotFoundError(`Category with id ${_id} not found`);
        }

        res.status(StatusCodes.OK).json({ category });
    } catch (error) {
        console.error(error);
        throw new BadRequestError("Invalid data");
    }
};

const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find();

        res.status(StatusCodes.OK).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};

const getSingleCategory = async (req, res) => {
    const { _id } = req.params;

    try {
        const category = await Category.findById(_id); 
        res.status(StatusCodes.OK).json({ category });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
}

export { createCategory, updateCategory, deleteCategory, getAllCategory, getSingleCategory };