const express = require("express");
const router = express.Router();

const AdminController =
 require("../controllers/adminController");

const auth =
 require("../middleware/auth");

router.post(
 "/login",
 AdminController.login
);

router.post(
 "/logout",
 auth,
 AdminController.logout
);

module.exports = router;