import fs from "fs";

export const emailTemplate = (filePath, variables = {}) => {
  let html = fs.readFileSync(filePath, "utf-8");

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, value ?? "");
  }

  return html;
};
