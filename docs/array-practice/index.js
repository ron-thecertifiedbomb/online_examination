import { urls } from "./data";

// 🧩 Array Manipulation Practice

// Keywords to search for
const filterStrings = ["dessert", "pizzas"];

// 🧠 1. Filtering
const filtered = urls.filter((url) =>
  filterStrings.some((keyword) => url.includes(keyword))
);
console.log("1️⃣ Filtered URLs:");
console.table(filtered);

// 🧠 2. Grouping by keyword
const grouped = {};
filterStrings.forEach((keyword) => {
  grouped[keyword] = urls.filter((url) => url.includes(keyword));
});
console.log("2️⃣ Grouped by keyword:");
console.log(grouped);

// 🧠 3. Limit to first 3 per keyword
const limited = {};
filterStrings.forEach((keyword) => {
  limited[keyword] = urls.filter((url) => url.includes(keyword)).slice(0, 3);
});
console.log("3️⃣ Limited to 3 each:");
console.log(limited);

// 🧠 4. Combine all into one array
const combined = Object.values(limited).flat();
console.log("4️⃣ Combined array:");
console.table(combined);

// 🧠 5. Remove duplicates (if any)
const unique = [...new Set(combined)];
console.log("5️⃣ Unique array:");
console.table(unique);

// 🧠 6. Shuffle (randomize order)
const shuffled = unique.sort(() => Math.random() - 0.5);
console.log("6️⃣ Shuffled array:");
console.table(shuffled);

// 🧠 7. Reusable helper function
function filterAndLimit(data, keywords, limit = 3) {
  const result = {};
  keywords.forEach((key) => {
    result[key] = data.filter((url) => url.includes(key)).slice(0, limit);
  });
  return result;
}

const testResult = filterAndLimit(urls, ["beverages", "dessert"], 2);
console.log("7️⃣ Test filterAndLimit():");
console.log(testResult);
