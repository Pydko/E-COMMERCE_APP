import mongoose from "mongoose";
import { Category } from "./db/categorySchema.mjs";
import { SubCategory } from "./db/subCategorySchema.mjs";

async function seedCategories() {
    await mongoose.connect("mongodb://localhost:27017/mydb");

    const countCat = await Category.countDocuments();
    const countSub = await SubCategory.countDocuments();

    if (countCat > 0 || countSub > 0) {
        console.log("CATEGORIES OR SUBCATEGORIES EXIST");
        return;
    }

  
    const fashion = await Category.create({ name: "Fashion", parentId: null });
    const tech = await Category.create({ name: "Technology", parentId: null });
    const home = await Category.create({ name: "Home", parentId: null });


    const fashionSubs = ["Tshirt", "Pants", "Jacket", "Shoes"];
    const techSubs = ["Telephone", "Laptop", "Tablets", "Headphones"];
    const homeSubs = ["Furniture", "Decoration", "Kitchen", "Garden"];

   
    for (let name of fashionSubs) {
        await SubCategory.create({ name, productType: fashion._id });
    }

    
    for (let name of techSubs) {
        await SubCategory.create({ name, productType: tech._id });
    }

   
    for (let name of homeSubs) {
        await SubCategory.create({ name, productType: home._id });
    }

    console.log("CATEGORIES & SUBCATEGORIES SEED DONE");
}

export { seedCategories };
