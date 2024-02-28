const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./auth.js");

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

const url = 'mongodb+srv://slawamiroshnik:FR2DMWPoO2TRrBtF@porfolio.2wshndl.mongodb.net/?retryWrites=true&w=majority&appName=Porfolio';

mongoose.connect(url);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.use("/api/auth", require("./routes"))

app.get("/", (req, res) => res.render("home"))
app.get("/register", (req, res) => res.render("register"))
app.get("/login", (req, res) => res.render("login"))
app.get("/admin", adminAuth, (req, res) => res.render("admin"))
app.get("/basic", userAuth, (req, res) => res.render("user"))

app.get("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: "1" })
    res.redirect("/")
})

app.listen(3000, function () {
    console.log('App listening on port 3000');
});