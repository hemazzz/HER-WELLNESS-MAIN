import express from "express";
import User from "../models/User.js";

const router = express.Router();


// ✅ GET PROFILE
router.get("/", async (req, res) => {

  try {

    const userId = req.user.id;

    const user = await User
      .findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to get profile"
    });

  }

});


// ✅ UPDATE PROFILE
router.put("/", async (req, res) => {

  try {

    const userId = req.user.id;

    console.log(
      "PROFILE UPDATE:",
      req.body
    );

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        req.body,
        {
          new: true,
          runValidators: true
        }
      ).select("-password");

    res.json({
      success: true,
      updatedUser
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Profile update failed"
    });

  }

});

export default router;