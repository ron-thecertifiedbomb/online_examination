import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    product: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image_url: { type: String, required: true },
    category: { type: String, required: true, index: true },
    is_available: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    discount_percentage: { type: Number, default: null },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    ingredients: [String],
    variants: [variantSchema],
  },
  {
    timestamps: true,
    collection: "products", // optional explicit name
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
