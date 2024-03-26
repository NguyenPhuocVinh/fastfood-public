import Category from "../../db/models/Category.js";
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../../errors/index.js';
import Product from '../../db/models/Product.js';

const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
}


export default getCategory;