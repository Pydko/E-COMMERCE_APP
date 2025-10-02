import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }], 
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategory: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        default: null
    }
});

export const Product = mongoose.model("Product", productSchema);