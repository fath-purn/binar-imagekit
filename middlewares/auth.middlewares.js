const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    restrict: (req, res, next) => {
        try {
            let { authorization } = req.headers;

            if (!authorization) {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized',
                    err: 'missing token on header!',
                    data: null
                });
            }

            authorization = authorization.replace('Bearer ', '');

            jwt.verify(authorization, JWT_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        status: false,
                        message: 'Unauthorized',
                        err: err.message,
                        data: null
                    });
                }

                // jika user belum membuat profile
                const profile = await prisma.profiles.findUnique({
                    where: {
                        user_id: decoded.id
                    }
                });

                if (!profile) {
                    req.profile = await prisma.users.findUnique({
                        where: {
                          id: decoded.id,
                        },
                        select: {
                            email: true,
                        }
                    });
                    next();
                }

                req.profile = await prisma.profiles.findUnique({
                    where: {
                      user_id: decoded.id,
                    },
                    select: {
                        first_name: true,
                        last_name: true,
                        user: {
                            select: {
                                email: true,
                            }
                        },
                        birth_date: true,
                        profile_picture: true,
                    }
                });
                next();
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
                err: error.message,
                data: null
            });
        }
        
    }
};