// productService.js
import Product from "../models/products.schema.js";

// all products
export const getAllProducts = async () => await Product.find();

//  product
export const getProductById = async (id) => await Product.findById(id);

//products by category
export const getProductsByCategory = async (category) =>
  await Product.find({ category: { $regex: `^${category}$`, $options: "i" } });

export const addProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

export const getAllProductBanners = async () => {
  const products = await Product.find({}, "image_url").lean();
  return products.map((p) => p.image_url);
};
