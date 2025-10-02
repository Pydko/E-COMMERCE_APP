import { Router } from "express";
import { Product } from "../db/productSchema.mjs";
import { Category } from "../db/categorySchema.mjs";
import { SubCategory } from "../db/subCategorySchema.mjs";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const comRouter = Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, path.join(__dirname, "../../public/src/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


comRouter.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (err) {
    console.error("GET /categories error:", err);
    res.status(500).json({ error: "SOMETHING WENT WRONG" });
  }
});

comRouter.get("/subcategories/:id", async (req, res) => {
  try {
    const subcategories = await SubCategory.find({
      productType: req.params.id,
    }).lean();
    res.json(subcategories);
  } catch (err) {
    console.error("GET /subcategories/:id error:", err);
    res.status(500).json({ error: "SOMETHING WENT WRONG" });
  }
});

comRouter.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { title, brand, price, productType, subCategory } = req.body;

  
    const imageArray = req.files ? req.files.map(file => `/src/images/${file.filename}`) : [];

    if (!title || !brand || !price || !productType) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    let categoryId = productType;
    if (!mongoose.Types.ObjectId.isValid(productType)) {
      const category = await Category.findOne({ name: productType });
      if (!category) return res.status(400).json({ msg: "Invalid category name" });
      categoryId = category._id;
    }

    let subCategoryId = subCategory;
    if (subCategory && !mongoose.Types.ObjectId.isValid(subCategory)) {
      const subCat = await SubCategory.findOne({ name: subCategory });
      if (!subCat) return res.status(400).json({ msg: "Invalid subcategory name" });
      subCategoryId = subCat._id;
    }

    const newProduct = new Product({
      title,
      brand,
      price,
      images: imageArray, 
      productType: categoryId,
      subCategory: subCategoryId,
    });

    await newProduct.save();

    res.status(201).json({ msg: "Product created", product: newProduct });
  } catch (err) {
    console.error("POST / error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


comRouter.get("/products/by-subcategory/:name", async (req, res) => {
  try {
    const subCategoryName = req.params.name;

    const subCat = await SubCategory.findOne({ name: subCategoryName }).lean();

    if (!subCat) {
      return res.status(404).json({ msg: "Subcategory not found" });
    }

    const products = await Product.find({ subCategory: subCat._id })
      .populate("productType", "name")
      .populate("subCategory", "name")
      .lean();

    res.json(products);
  } catch (err) {
    console.error("GET /products/by-subcategory/:name error:", err);
    res.status(500).json({ error: "SOMETHING WENT WRONG" });
  }
});


comRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("productType", "name")
      .populate("subCategory", "name")
      .lean();

    res.json(products);
  } catch (err) {
    console.error("GET / error:", err);
    res.status(500).json({ error: "SOMETHING WENT WRONG" });
  }
});


comRouter.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: "Invalid Product ID" });
        }

        const product = await Product.findById(req.params.id)
            .populate("productType", "name")
            .populate("subCategory", "name")
            .lean();

        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        console.error("GET /:id error:", err);
        res.status(500).json({ error: "SOMETHING WENT WRONG" });
    }
});



comRouter.patch("/:id", upload.array("images", 5), async (req, res) => {
    try {
        const { title, brand, price, productType, subCategory } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: "Invalid Product ID" });
        }

        const updateFields = {};
        
       
        if (title) updateFields.title = title;
        if (brand) updateFields.brand = brand;
        if (price) updateFields.price = price;

        
        if (productType) {
            let categoryId = productType;
            if (!mongoose.Types.ObjectId.isValid(productType)) {
                const category = await Category.findOne({ name: productType });
                if (!category) return res.status(400).json({ msg: "Invalid category name" });
                categoryId = category._id;
            }
            updateFields.productType = categoryId;
        }

       
        if (subCategory !== undefined) {
            let subCategoryId = subCategory;
            if (subCategory === "null" || subCategory === "") {
                subCategoryId = null; 
            } else if (!mongoose.Types.ObjectId.isValid(subCategory)) {
                const subCat = await SubCategory.findOne({ name: subCategory });
                if (!subCat) return res.status(400).json({ msg: "Invalid subcategory name" });
                subCategoryId = subCat._id;
            }
            updateFields.subCategory = subCategoryId;
        }


        
        if (req.files && req.files.length > 0) {
            const imageArray = req.files.map(file => `/src/images/${file.filename}`);
            
            updateFields.images = imageArray; 
        } else if (req.body.clearImages === 'true') {
          
            updateFields.images = [];
        }


        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ msg: "No fields to update" });
        }


        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        )
            .populate("productType", "name")
            .populate("subCategory", "name")
            .lean();

        if (!updatedProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }

        res.json({ msg: "Product updated", product: updatedProduct });

    } catch (err) {
        console.error("PATCH /:id error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});



comRouter.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: "Invalid Product ID" });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }

      

        res.json({ msg: "Product deleted successfully", product: deletedProduct });
    } catch (err) {
        console.error("DELETE /:id error:", err);
        res.status(500).json({ error: "SOMETHING WENT WRONG" });
    }
});


export { comRouter };