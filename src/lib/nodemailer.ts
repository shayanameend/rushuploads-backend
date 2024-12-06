import nodemailer from "nodemailer";

const nodemailerTransporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "enola55@ethereal.email",
    pass: "FYzQB9X4tgFkCBeu7Z",
  },
});

export { nodemailerTransporter };
