// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");

exports.sendEmail = async (emailOptions) => {
  //1) Create Transporter (service that will send email)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, //port 587 if the secure is false
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2) Defined email options (like from ... to ... )
  const mailOpt = {
    from: "P Store Team <pstore345@gmail.com>",
    to: emailOptions.email,
    subject: emailOptions.subject,
    text: emailOptions.message,
    html: emailOptions.html,
  };
  //3) Send email
  await transporter.sendMail(mailOpt);
};
// exports.sendSMS = (SMSmessage) => {

// };
