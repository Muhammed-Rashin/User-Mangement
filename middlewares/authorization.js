const jwt = require("jsonwebtoken");

module.exports = {
  userAuthorization: async (req, res, next) => {
    if (req.cookies.Accesstoken) {
      jwt.verify(
        req.cookies.Accesstoken,
        process.env.JWT_AUTHORIZATION_KEY,
        (err, decoded) => {
          if (err) {
            res.redirect("/login");
          } else {
            next()
          }
        }
      );
    } else {
      res.redirect("/login");
    }
  },
  loginProtector: async (req, res, next) => {

    if (req.cookies.Accesstoken) {
      jwt.verify(
        req.cookies.Accesstoken,
        process.env.JWT_AUTHORIZATION_KEY,
        (err, decoded) => {
          if (err) {
            next()
          } else {
            res.redirect("/")
          }
        }
      );
    } else {
      next()
    }

  }
};
