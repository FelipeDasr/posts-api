const { getToken } = require('../utils');
const { User } = require('../models');

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {

    const bearerToken = req.headers.authorization;
    const token = getToken(bearerToken);

    if (token) {
        jwt.verify(token, process.env.API_TOKEN, async (err, payload) => {
            if (err) {
                switch (err.name) {
                    case 'TokenExpiredError':
                        return res.status(401).json({
                            tokenError: true,
                            msg: 'Expired token'
                        });

                    default:
                        return res.status(401).json({
                            tokenError: true,
                            msg: 'Invalid token'
                        });
                }
            }

            const user = await User.findOne({
                where: { id: payload.id }
            });

            if (!user) {
                return res.status(401).json({
                    tokenError: true,
                    msg: 'Invalid token'
                });
            }

            req.user = user;
            return next();
        });
    }
    else {
        return res.status(401).json({
            tokenError: true,
            msg: 'Missing token'
        });
    }
}