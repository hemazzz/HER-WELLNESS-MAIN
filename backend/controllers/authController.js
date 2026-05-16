import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

// 📧 MAIL CONFIG (⚠️ move to .env later da)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "hemadharshini0109@gmail.com",
    pass: "qplj dela fsti gezx"
  }
});


// 🔹 SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false
    });

    console.log("Generated OTP:", otp);

    await User.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
        isVerified: false
      },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: '"Her Wellness App" <hemadharshini0109@gmail.com>',
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp} (valid for 5 minutes)`
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};


// 🔹 VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};


// 🔹 REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Send OTP first" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Verify OTP first" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔥 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password ❌" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login error ❌" });
  }
};

// 🔹 FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false
    });

    console.log("Reset OTP:", otp);

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: '"Her Wellness App" <hemadharshini0109@gmail.com>',
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP sent" });

  } catch (err) {
    res.status(500).json({ message: "Error sending OTP" });
  }
};


// 🔹 RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Reset password error" });
  }
};






















