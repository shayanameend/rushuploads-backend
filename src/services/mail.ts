import { nodemailerTransporter } from "../lib/nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  body: string;
}

async function sendMail({ to, subject, body }: Readonly<MailOptions>) {
  nodemailerTransporter.sendMail(
    {
      from: process.env.MAIL_FROM,
      to,
      subject,
      text: body,
    },
    (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    },
  );
}

export { sendMail };
