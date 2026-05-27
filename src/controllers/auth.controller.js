const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// User register controller
// POST: /api/auth/register

async function userRegisterController(req, res) {
    try {
        const { name, password, email } = req.body;

        if (!name || !password || !email) {
            return res.status(400).json({
                message: 'Name, email, and password are required.',
                status: 'Failed',
            });
        }

        const isExists = await userModel.findOne({
            email: email,
        });
        if (isExists) {
            return res.status(422).json({
                message: 'User already exists.',
                status: 'Failed',
            });
        }

        const user = await userModel.create({
            name,
            password,
            email,
        });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '3d',
        });

        res.cookie('token', token);

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error during registration.',
            error: error.message,
        });
    }
}

module.exports = {
    userRegisterController,
};
