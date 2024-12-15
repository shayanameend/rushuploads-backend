import { nodemailerTransporter } from "../lib/nodemailer";

interface SendOTPOptions {
  to: string;
  code: string;
}

async function sendOTP({ to, code }: Readonly<SendOTPOptions>) {
  nodemailerTransporter.sendMail(
    {
      from: {
        name: "Rush Uploads",
        address: "support@rushuploads.com",
      },
      to,
      subject: "Verify Your Email",
      text: `Your OTP Code is: ${code}`,
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
}

interface SendFilesOptions {
  to: string;
  title: string;
  message: string;
  files: {
    originalName: string;
    name: string;
    type: string;
  }[];
}

async function sendFiles({
  to,
  title,
  message,
  files,
}: Readonly<SendFilesOptions>) {
  nodemailerTransporter.sendMail(
    {
      from: {
        name: "Rush Uploads",
        address: "support@rushuploads.com",
      },
      to,
      subject: title,
      text: message,
      attachments: files.map((file) => ({
        filename: file.originalName,
        path: `http://localhost:8080/uploads/${file.name}`,
        contentType: file.type,
      })),
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
}

export { sendOTP, sendFiles };
