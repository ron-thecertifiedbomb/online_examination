import { emailTemplate } from "./common/helpers/emailTemplate.js";

const clients = [{ name: "Ronan Sibunga" }, { name: "Mich Sibunga" }];

for (const client of clients) {
  const html = emailTemplate("./common/templates/emailTemplate.html", {
    name: client.name,
  });
  console.log(`\n--- Email for ${client.name} ---\n`);
  console.log(html);
}
