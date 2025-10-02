import mongoose from "mongoose";

const subcategories = new mongoose.Schema({
    name: { type: String, required: true },
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
});

export const SubCategory = mongoose.model("SubCategory", subcategories);
