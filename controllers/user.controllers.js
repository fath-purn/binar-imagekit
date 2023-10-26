const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password, password_confirmation } = req.body;
      
        if (!email || !password || !password_confirmation) {
          return res.status(400).json({
            status: false,
            message: "Bad Request",
            err: "Please provide email, password, and password confirmation",
            data: null,
          });
        }

        if (password !== password_confirmation) {
          return res.status(400).json({
            status: false,
            message: "Bad Request",
            err: "Please ensure that the password and password confirmation match!",
            data: null,
          });
        }

        // Untuk mengecek apakah email sudah terdaftar
        const user = await prisma.users.findUnique({
          where: {
            email,
          },
        });

        // validasi jika email sudah terdaftar
        if (user) {
          return res.status(400).json({
            status: false,
            message: "Bad Request",
            err: "Email already exists",
            data: null,
          });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.users.create({
          data: {
            email,
            password: encryptedPassword,
          },
        });

        res.status(201).json({
          status: true,
          message: "Created",
          err: null,
          data: newUser,
        });
      } catch (err) {
        res.status(500).json({
        status: false,
        message: "Internal Server Error",
        err: "Something went wrong",
        data: null,
      });
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "Bad Request",
          err: "Please provide email and password",
          data: null,
        });
      }
    
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });

        if (!user) {
          return res.status(400).json({
            status: false,
            message: "Bad Request",
            err: "Invalid email or password",
            data: null,
          });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          return res.status(400).json({
            status: false,
            message: "Bad Request",
            err: "Invalid email or password",
            data: null,
          });
        }

        if (!JWT_SECRET_KEY) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            err: "JWT_SECRET_KEY is not defined",
            data: null,
          });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

        return res.status(200).json({
          status: true,
          message: "OK",
          err: null,
          data: { user, token },
        });
      } catch (err) {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          err: "Something went wrong",
          data: null,
        });
      }
  },

  authenticate: (req, res, next) => {
    const profile = req.profile;

    return res.status(200).json({
      status: true,
      message: "OK",
      err: null,
      data: {
        profile: !profile.first_name
          ? {
              first_name: null,
              last_name: null,
              email: profile.email,
              birth_date: null,
              profile_picture: null,
            }
          : {
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.user.email,
              birth_date: profile.birth_date,
              profile_picture: profile.profile_picture,
            },
      },
    });
  },
};
