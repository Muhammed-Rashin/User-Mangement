const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const verifyEmail = ({ email, username }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pradaxofficial@gmail.com",
      pass: process.env.EMAIL_APP_PASS ,
    },
  });

  const token = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_EMAIL_VERIFICATION,
    { expiresIn: "5m" }
  );

  const mailConfigurations = {
    // It should be a string of sender/server email
    from: "pradaxofficial@gmail.com",

    to: email,

    // Subject of Email
    subject: "Email Verification For User Management System",

    // This would be the text of email body
    text: `Hi! ${username}, You have recently visited 
    our website and entered your email.
    Please follow the given link to verify your email
    http://localhost:3000/verifyEmail/${token}
    This Link only valid for 5 Minuts
    Thanks`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    else console.log("Email Sent Successfully");
  });
};

module.exports = verifyEmail;
