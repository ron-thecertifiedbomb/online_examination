import express from "express";
import {
  fetchProducts,
  fetchProductBanners,
  fetchProduct,
  fetchProductsByCategory,
  createProduct,
} from "../controller/productController.js";

const router = express.Router();

// Routes
router.get("/", fetchProducts);
router.get("/banners", fetchProductBanners);
router.get("/category/:category", fetchProductsByCategory);
router.get("/id/:id", fetchProduct);
router.post("/", createProduct);

export default router;
