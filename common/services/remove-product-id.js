import fs from "fs";
import path from "path";
import { products } from "../server/data/products.js"; // adjust path if needed

// Remove 'product_id' from each product
const cleanedProducts = products.map((p) => {
  const { product_id, ...rest } = p;
  return rest;
});

// Save to a new JSON file
const filePath = path.resolve("./server/data/products_cleaned.json");
fs.writeFileSync(filePath, JSON.stringify(cleanedProducts, null, 2));

console.log(`✅ Removed 'product_id' from all products. Saved to ${filePath}`);
