const express = require("express")
const router = express.Router()
const {register, login} = require("./auth")
const {addItem} = require("./admin")

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/admin/add").post(addItem)

module.exports = router