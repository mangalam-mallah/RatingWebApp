import User from "../models/user.model.js";
import Store from "../models/store.model.js";
import Rating from "../models/rating.model.js";
import bcrypt from 'bcrypt'

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.status(200).json({
      message: "Admin Dashboard Stats",
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (error) {
    console.error("Error in getDashboard:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    let filter = {};

    if (name) filter.name = new RegExp(name, "i");
    if (email) filter.email = new RegExp(email, "i");
    if (address) filter.address = new RegExp(address, "i");
    if (role) filter.role = role;

    let users = await User.find(filter).select("-password");

    const usersWithRatings = await Promise.all(
      users.map(async (user) => {
        if (user.role === "storeOwner") {
          const store = await Store.findOne({ ownerId: user._id });
          if (store) {
            const ratings = await Rating.find({ storeId: store._id });
            const avgRating =
              ratings.length > 0
                ? (
                    ratings.reduce((sum, r) => sum + r.value, 0) /
                    ratings.length
                  ).toFixed(2)
                : 0;
            return {
              ...user.toObject(),
              store: {
                name: store.name,
                address: store.address,
                averageRating: avgRating,
              },
            };
          }
        }
        return user;
      })
    );

    res.status(200).json(usersWithRatings);
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    let filter = {};

    if (name) filter.name = new RegExp(name, "i");
    if (email) filter.email = new RegExp(email, "i");
    if (address) filter.address = new RegExp(address, "i");

    const stores = await Store.find(filter).populate("ownerId", "name email");

    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.find({ storeId: store._id });
        const avgRating =
          ratings.length > 0
            ? (
                ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
              ).toFixed(2)
            : 0;

        return {
          ...store.toObject(),
          averageRating: avgRating,
        };
      })
    );

    res.status(200).json(storesWithRatings);
  } catch (error) {
    console.error("Error in getAllStores:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const create_user = async (req, res) => {
  try {
    const { name, email, role, password, address } = req.body;

    if (!name || !email || !password || !role || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["ADMIN", "USER", "STORE_OWNER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    if (password.length < 8 || password.length > 16) {
      return res
        .status(400)
        .json({ message: "Password must be 8–16 characters" });
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
      return res.status(400).json({
        message:
          "Password must include at least one uppercase letter and one special character",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      address,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getDashboard, getAllUsers, getAllStores, create_user };
