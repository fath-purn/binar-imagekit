const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../libs/imagekit");
const path = require("path");

module.exports = {
  createProfile: async (req, res, next) => {
    try {
      const { user_id, first_name, last_name, birth_date } = req.body;

      // Validate input fields
      if (!user_id || !first_name || !last_name || !birth_date) {
        return res.status(400).json({
          status: false,
          message: "Bad Request",
          err: "All field must be filled",
          data: null,
        });
      }

      // Check if user exists in the database
      const checkUser = await prisma.users.findUnique({
        where: {
          id: Number(user_id),
        },
      });
      if (!checkUser) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
          err: "User not found",
          data: null,
        });
      }

      // Handle profile image securely
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          status: false,
          message: "Bad Request",
          err: "Profile image is required",
          data: null,
        });
      }
      const { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(file.originalname),
        file: file.buffer,
      });

      // Convert birth_date to ISO
      const birthDate = new Date(birth_date).toISOString();

      // Check if user already has a profile
      const checkProfile = await prisma.profiles.findUnique({
        where: {
          user_id: Number(user_id),
        },
      });

      if (checkProfile) {
        // Update existing profile
        const updateProfile = await prisma.profiles.update({
          where: {
            user_id: Number(user_id),
          },
          data: {
            first_name,
            last_name,
            birth_date: birthDate,
            profile_picture: url,
          },
        });
        res.status(201).json({
          status: true,
          message: "Updated",
          err: null,
          data: updateProfile,
        });
      } else {
        // Create new profile
        const createProfile = await prisma.profiles.create({
          data: {
            user_id: Number(user_id),
            first_name,
            last_name,
            birth_date: birthDate,
            profile_picture: url,
          },
        });
        res.status(201).json({
          status: true,
          message: "Created",
          err: null,
          data: createProfile,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        err: err.message,
        data: null,
      });
    }
  },
};
