const { getMissingFields } = require("../utils");
const { User } = require("../models");

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Signup = async (req, res) => {

    const missingFields = getMissingFields(
        ["firstName", "lastName", "email", "password"],
        req.body
    );

    if (missingFields.length) {
        return res.status(422).json({
            msg: 'Missing fields',
            missingFields,
            error: true
        });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
        const userAlreadyExists = await User.findOne({ where: { email: email } },
            { raw: true }
        );

        if (userAlreadyExists) {
            return res.status(422).json({
                msg: 'Email is already registered',
                error: true
            });
        }

        const passInHash = await bcrypt.hash(password, 10);

        await User.create({
            firstName, lastName, email, password: passInHash
        });

        return res.status(201).json({
            msg: 'User created successfully',
            error: false
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Error when trying to create user',
            error: true
        })
    }
}

const Signin = async (req, res) => {

    const missingFields = getMissingFields(
        ['email', 'password'],
        req.body
    );

    if (missingFields.length) {
        return res.status(422).json({
            msg: 'Missing fields',
            missingFields,
            error: true
        });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } },
            { raw: true }
        );

        if (!user) {
            return res.status(401).json({
                msg: "User doesn't exist",
                error: true
            });
        }

        const passwordIsCorrect = await bcrypt.compare(
            password, user.password
        );

        if (passwordIsCorrect) {
            const apiToken = process.env.API_TOKEN;
            const options = { expiresIn: '24h' };
            const payload = { id: user.id };

            jwt.sign(payload, apiToken, options, (err, token) => {
                if (err) {
                    return res.status(500).json({
                        msg: 'Error when trying to generate a token',
                        error: true
                    });
                }
                return res.status(200).json({
                    msg: 'Successful signin',
                    token,
                    error: false
                });
            });
        }
        else {
            return res.status(401).json({
                msg: 'Email or Password is incorrect',
                error: true
            });
        }
    }
    catch (e) {
        return res.status(500).json({
            msg: 'Error when trying to verify token',
            error: true
        })
    }

}

module.exports = {
    Signup,
    Signin,
}
