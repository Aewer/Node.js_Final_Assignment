const express = require("express")
const router = express.Router()
const {register, login} = require("./auth")
const { adminAuth } = require("./auth")

router.route("/register").post(register)
router.route("/login").post(login);

module.exports = router