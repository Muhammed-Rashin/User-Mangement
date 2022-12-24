const express = require("express");
const controller = require("../controller/user.controller");
const authorization = require("../middlewares/authorization");
const router = express.Router();

/* GET home page. */
router.get("/", authorization.userAuthorization, function (req, res, next) {
  res.render("user/index");
});

router.get("/login", authorization.loginProtector, function (req, res) {
  res.render("user/login");
});

router.post("/login", authorization.loginProtector, controller.doLogin);

router.post("/signup", authorization.loginProtector, controller.doSignup);

router.post("/resendEmail", authorization.loginProtector, controller.resendEmail);

router.get("/verifyEmail/:token",authorization.loginProtector,controller.verifyEmail);

module.exports = router;
