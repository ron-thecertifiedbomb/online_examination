import { header } from "./components/header.js";
import counter from "./components/counter.js";

const main = document.getElementById("main");

main.appendChild(
  header("Welcome to Classic JS", "This is a typical HTML + JS approach.")
);
main.appendChild(counter());

console.log("Javascript is running via classic.html (client side rendering)");

const getData = () => {
 const data =  fetch("http://localhost:8080/api/products/banners")
  .then((response) => {
    // Check if the response was successful (e.g., HTTP status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Parse the response body as JSON
    return response.json();
  })
  .then((data) => {
    // Work with the parsed data

    const filterStrings = ["dessert", "pizza"];

    // Filter URLs that include any of the keywords
    const filteredItems = data.filter((url) =>
      filterStrings.some((keyword) => url.toLowerCase().includes(keyword))
    );

    console.log("Filtered Items:", filteredItems);
    return filteredItems;


  })
  .catch((error) => {
    // Handle any errors that occurred during the fetch or parsing
    console.error("Error fetching data:", error);
  });
return data
}

// const getData = () => {
//   const data = fetch("http://localhost:8080/api/products/banners")
//     .then((response) => {
//       // Check if the response was successful (e.g., HTTP status 200-299)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       // Parse the response body as JSON
//       return response.json();
//     })
//     .then((data) => {
//       // Work with the parsed data

//       const filterStrings = ["dessert", "pizza"];

//       const filteredResults = {};

//       filterStrings.forEach((keyword) => {
//         filteredResults[keyword] = data
//           .filter((url) => url.toLowerCase().includes(keyword))
//           .slice(0, 3); // ✅ limit to first 3 URLs for each keyword
//       });
//       console.log("Filtered Items:", filteredResults);
//       return filteredResults;
//     })
//     .catch((error) => {
//       // Handle any errors that occurred during the fetch or parsing
//       console.error("Error fetching data:", error);
//     });
//   return data;
// };



getData();

