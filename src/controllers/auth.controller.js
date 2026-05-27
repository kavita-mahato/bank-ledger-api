const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require("../services/email.service");

// User Register Controller - POST: /api/auth/register
async function userRegisterController(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                message: 'Name, email, and password are required.',
                status: 'Failed',
            });
        }

        const isExists = await userModel.findOne({email: email,});

        if (isExists) {
            return res.status(422).json({
                message: 'User already exists.',
                status: 'Failed',
            });
        }
        const user = await userModel.create({
            email,
            password,
            name,
        });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: '3d',});

        res.cookie('token', token);

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });
        await emailService.sendRegistrationEmail(user.email, user.name);
    } catch (error) {
        res.status(500).json({
            message: 'Server error during registration.',
            error: error.message,
        });
    }
}

// User login Controller - POST: /api/auth/login
async function userLoginController(req, res) {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email}).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "Email or Password is INVALID"
            })
        }
        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Email or Password is INVALID"
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: '3d',});

        res.cookie('token', token);

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Unable to Login',
            error: error.message,
        });
    }
}

module.exports = {
    userRegisterController,
    userLoginController
};
