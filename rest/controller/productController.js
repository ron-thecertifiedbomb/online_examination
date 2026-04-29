import {
  getAllProducts,
  getProductById,
  addProduct,
  getProductsByCategory,
  getAllProductBanners,
} from "../../common/services/productService.js";

// GET all products
export const fetchProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// GET all products banners
export const fetchProductBanners = async (req, res) => {
  try {
    const banners = await getAllProductBanners();
    res.status(200).json(banners);
    console.log("all product banners", banners);
  } catch (err) {
    console.error("❌ Error fetching product banners:", err);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// GET product by ID
export const fetchProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(`❌ Error fetching product by ID "${id}":`, err);
    res.status(500).json({ message: "Server error fetching product" });
  }
};

// GET products by category (case-insensitive)
export const fetchProductsByCategory = async (req, res) => {
  let { category } = req.params;

  if (!category || category.trim() === "") {
    return res.status(400).json({ message: "Category is required" });
  }

  category = category.trim();

  try {
    const products = await getProductsByCategory(category);

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: `No products found in category "${category}"` });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error(`❌ Error fetching products by category "${category}":`, err);
    res
      .status(500)
      .json({ message: "Server error fetching products by category" });
  }
};

// POST create product
export const createProduct = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Product data is required" });
  }

  try {
    const product = await addProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ message: "Server error creating product" });
  }
};
