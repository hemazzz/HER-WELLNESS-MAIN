import User from "../models/User.js";

// ✅ GET PROFILE
export const getProfile = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found ❌"
      });
    }

    res.json(user);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Profile fetch failed ❌"
    });
  }
};

// ✅ UPDATE PROFILE
export const updateProfile = async (req, res) => {

  try {

    console.log(
      "PROFILE UPDATE:",
      req.body
    );

    const updatedUser =
      await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true }
      ).select("-password");

    res.json({
      success: true,
      updatedUser
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Profile update failed ❌"
    });
  }
};