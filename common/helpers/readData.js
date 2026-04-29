import fs from "fs";

export const readData = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error(`Error reading JSON from ${filePath}:`, err.message);
    return null;
  }
};

export const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`Error writing JSON to ${filePath}:`, err.message);
    return false;
  }
};
