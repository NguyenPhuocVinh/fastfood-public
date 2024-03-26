import mongoose from "mongoose";
import validator from "validator";

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true
    },
    imagePath: {
        type: String,
        required: [true, "Please provide image path"],
        validate: {
            validator: function (value) {
                return /\.(jpg|jpeg|png|gif)$/.test(value.toLowerCase());
            },
            message: "Invalid image path"
        }
    }
})

export default mongoose.model("Category", categorySchema);