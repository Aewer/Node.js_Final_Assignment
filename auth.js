const {User} = require("./model")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const jwtSecret = 'f790d5798f6622bf1d659c0cbfdad2e4e35236e5e79ef6dcf2ff8540bd0278053fc583'

exports.register = async (req, res, next) => {
    const {username, password, firstName, lastName, age, country, gender} = req.body
    if (password.length < 6) {
        return res.status(400).json({message: "Password less than 6 characters"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const user = await User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            age,
            country,
            gender,
        })
        const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
                expiresIn: '1h',
            }
        );
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 3600000,
        });
        res.status(201).json({
            message: "User successfully created",
            user: user._id,
        });
    } catch (err) {
        res.status(401).json({
            message: "Failed to create user",
            error: err.message,
        })
    }
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password required",
        })
    }
    try {
        const user = await User.findOne({username})
        if (!user) {
            res.status(401).json({
                message: "Login not successful",
                error: "User not found",
            })
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign(
                { id: user._id, username, role: user.role },
                jwtSecret,
                {
                    expiresIn: '1h',
                }
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 3600000,
            });
            res.status(201).json({
                message: "User successfully Logged in",
                user: user._id,
            })
        }
        else {
            return res.status(401).json({
                message: "Login not successful",
                error: "Invalid password",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        })
    }
}

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                if (decodedToken.role !== "admin") {
                    return res.status(401).json({ message: "Not authorized" })
                } else {
                    next()
                }
            }
        })
    } else {
        return res
            .status(401)
            .json({message: "Not authorized, token not available"})
    }
}

exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({message: "Not authorized"})
            } else {
                if (decodedToken.role !== "Basic" && decodedToken.role !== "admin") {
                    return res.status(401).json({message: "Not authorized"})
                } else {
                    next()
                }
            }
        })
    } else {
        return res
            .status(401)
            .json({ message: "Not authorized, token not available" })
    }
}