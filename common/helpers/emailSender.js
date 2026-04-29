// emailSender.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

// Configure your SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send a single email
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: '"Ronan Dev Solutions" <ronandev.digitalsolutions@gmail.com>',
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending email to ${to}:`, err);
  }
};

// Function to send batch emails
export const sendBatchEmails = async (clients, subject, templateFn) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  for (const client of clients) {
    const html = templateFn(client);
    await transporter.sendMail({
      user: process.env.EMAIL_USER,
      to: client.email,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${client.email}`);
  }
};