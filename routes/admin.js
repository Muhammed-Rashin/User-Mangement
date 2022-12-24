const express = require("express");
const controller = require("../controller/admin.controller");
const { doSignup } = require("../controller/user.controller");
const authorization = require("../middlewares/authorization");
const router = express.Router();

/* GET home page. */
router.get("/",controller.getAdminPage);

router.post("/editUser", controller.editUser)

router.post('/deleteUser',controller.deleteUser)

router.post('/addUser', doSignup)

module.exports = router;
