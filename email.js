import { sendBatchEmails } from "./common/helpers/emailSender.js";
import { emailTemplate } from "./common/helpers/emailTemplate.js"; // ✅ Correct path

// List of clients (small strategic batch)
const clients = [
  { name: "Ronan Sibunga", email: "ronan.sibunga@gmail.com" },
  { name: "Mich Sibunga", email: "mich.sumida@gmail.com" },
];

// Subject
const subject = "Ronan Dev: Solutions Tailored for You";

// Function that loads and injects the HTML template
const createTemplate = (client) =>
  emailTemplate("./common/templates/emailTemplate.html", { name: client.name });

// Send the emails
sendBatchEmails(clients, subject, createTemplate)
  .then(() => console.log("✅ All emails sent!"))
  .catch((err) => console.error("❌ Error sending batch:", err));
