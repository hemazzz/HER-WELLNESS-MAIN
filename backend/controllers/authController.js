import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

// 📧 MAIL CONFIG (SMTP use pannom 🔥)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "hemadharshini0109@gmail.com",       // 🔥 un gmail
    pass: "qplj dela fsti gezx"            // 🔥 app password
  }
});

// 🔹 REGISTER + OTP
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false
    });

    console.log("Generated OTP:", otp);

    const user = new User({
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000
    });

    await user.save();

    // 📩 SEND MAIL
    try {
      const info = await transporter.sendMail({
        from: '"Her Wellness App" <YOUR_GMAIL@gmail.com>',
        to:"YOUR_GMAIL@gmail.com",
        subject: "OTP Verification",
        text: `Hello,

Your OTP is ${otp}

Valid for 5 minutes.`
      });

      console.log("Mail sent ✅:", info.response);

    } catch (err) {
      console.log("MAIL ERROR ❌:", err);
    }

    res.json({ message: "OTP sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 VERIFY OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.otp !== otp) {
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
};

// 🔹 LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.isVerified)
    return res.status(400).json({ message: "Verify email first" });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
    expiresIn: "1d"
  });

  res.json({ token });
};

// 🔹 FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
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

  try {
    await transporter.sendMail({
      from: '"Her Wellness App" <YOUR_GMAIL@gmail.com>',
      to:"YOUR_GMAIL@gmail.com",
      subject: "Reset Password OTP",
      text: `Your OTP is ${otp}`
    });

    console.log("Mail sent ✅");
  } catch (err) {
    console.log("MAIL ERROR ❌:", err);
  }

  res.json({ message: "OTP sent" });
};

// 🔹 RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.otp !== otp) {
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
};






















