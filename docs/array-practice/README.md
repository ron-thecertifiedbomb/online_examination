💪 Practice Plan: Array Manipulation & Combination

Here’s a step-by-step challenge list (each one builds on the last):

🧩 1. Filtering

Start with:

const urls = [
  "https://cdn/menus/dessert/cake.webp",
  "https://cdn/menus/dessert/icecream.webp",
  "https://cdn/menus/pizzas/margherita.webp",
  "https://cdn/menus/pizzas/pepperoni.webp",
  "https://cdn/menus/beverages/coffee.webp",
];


✅ Goal: get only dessert URLs

const desserts = urls.filter((url) => url.includes("dessert"));
console.log(desserts);

🧩 2. Multiple keyword filtering

✅ Goal: get both desserts and pizzas

const filterStrings = ["dessert", "pizzas"];
const selected = urls.filter((url) =>
  filterStrings.some((keyword) => url.includes(keyword))
);
console.log(selected);

🧩 3. Grouping by keyword

✅ Goal: create an object that groups URLs per keyword

const grouped = {};
filterStrings.forEach((keyword) => {
  grouped[keyword] = urls.filter((url) => url.includes(keyword));
});
console.log(grouped);

🧩 4. Limit number per keyword

✅ Goal: only first 2 of each keyword

const limited = {};
filterStrings.forEach((keyword) => {
  limited[keyword] = urls
    .filter((url) => url.includes(keyword))
    .slice(0, 2);
});
console.log(limited);

🧩 5. Combine all into one array

✅ Goal: flatten grouped results

const combined = Object.values(limited).flat();
console.log(combined);

🧩 6. Shuffle the array (bonus practice)

✅ Goal: randomize the combined array

const shuffled = combined.sort(() => Math.random() - 0.5);
console.log(shuffled);

🧩 7. Remove duplicates

✅ Goal: remove duplicate URLs (if any)

const unique = [...new Set(combined)];
console.log(unique);