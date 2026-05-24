const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express();

// POST: /api/auth/resiter
router.post("/register", authController.userRegisterController);

module.exports = router;