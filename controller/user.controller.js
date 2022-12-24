const jwt = require("jsonwebtoken");
const databaseHelper = require("../database_helper/user_helper");
const verifyEmail = require("../verifyEmail/verifyEmail");

module.exports = {
  doSignup: (req, res) => {
    console.log(req.body);
    databaseHelper.doSignup(req.body, (result) => {
      if (result === "Success") {
        verifyEmail(req.body);
        res.send({ status: "Success" });
      } else if (result === "ER_DUP_ENTRY") {
        res.send({ status: "Duplicate" });
      } else {
        res.send({ status: false });
      }
    });
  },
  doLogin: (req, res) => {
    databaseHelper.doLogin(req.body, async (result) => {
      if (result === "Error") res.send({ status: "Error" });
      else if (!result) res.send({ status: false });
      else if (result.user_status === "unverified")
        res.send({
          status: "unverified",
          username: result.user_name,
          email: result.user_email,
        });


      else if(result === "blocked") res.send({ status: "blocked"});

      else {
        const data = { email: result.user_email, username: result.user_name };
        const token = await jwt.sign(data, process.env.JWT_AUTHORIZATION_KEY, {
          expiresIn: "60m",
        });
        res.cookie("Accesstoken", token, {
          sameSite: "Strict",
          expires: new Date("01 12 2023"),
          secure: true,
          path: "/",
        });
        res.send({ status: "Success" });
      }
    });
  },

  resendEmail: (req, res) => {
    console.log(req.body);
    verifyEmail(req.body);
  },

  verifyEmail: (req, res) => {
    const { token } = req.params;
    jwt.verify(
      token,
      process.env.JWT_EMAIL_VERIFICATION,
      async (err, decoded) => {
        if (err) {
          console.log(err);
          res.send("Verification Failed");
        } else {
          await databaseHelper.verifyEmail(decoded.email);
          res.send("Email Verified Successfully Please login Again");
        }
      }
    );
  },
};
