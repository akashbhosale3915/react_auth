import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import mongoose from "mongoose";
import { validate } from "../utils/validators.js";
import lodash from "lodash";
import cryptoRandomString from "crypto-random-string";
import {
  dnsErrorCodes,
  sendEmail,
} from "../utils/sendMail.js";
async function createUser(req, res) {
  const { username, password, email, phone } = req.body;

  const errors = validate({
    username,
    password,
    email,
    phone,
  });

  if (errors.length) {
    return res
      .status(400)
      .json({ success: false, message: errors[0] });
  }

  try {
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message:
          "User with this username or email already exists. Please login.",
      });
    }

    const otpExists = await OTP.findOne({ email });

    if (otpExists) {
      return res.status(200).json({
        success: true,
        message:
          "OTP already sent. Please check your email.",
      });
    }

    const otp = cryptoRandomString({
      length: 6,
      type: "numeric",
    });

    await sendEmail(email, otp);

    const userOTP = new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    await userOTP.save();

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    if (dnsErrorCodes.includes(error.code)) {
      return res.status(400).json({
        success: false,
        message: "Domain not found. Enter a valid email.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

    console.log(error);
  }
}
async function deleteUser(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ error: "Invalid user ID format" });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (req.user._id !== user._id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to edit this user",
      });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    console.log(error);
  }
}
async function editUser(req, res) {
  const { id } = req.params;
  const { username, password, email, phone } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    });
  }

  try {
    const errors = validate({
      username,
      password,
      email,
      phone,
    });

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user._id !== user._id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to edit this user",
      });
    }

    user.username = username;
    user.email = email;
    user.phone = phone;

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      // Hash the new password before saving
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      ...user?._doc,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Username taken, please choose a different username.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    console.log(error);
  }
}
async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    console.log(error);
  }
}

async function verifyOTP(req, res) {
  const { user, otp } = req.body;
  try {
    const userOTP = await OTP.findOne({
      email: user.email,
    });

    if (!userOTP) {
      return res
        .status(404)
        .json({ success: false, message: "OTP not found" });
    }

    if (userOTP.otp !== otp) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP" });
    }

    const expiresAt = new Date(userOTP.expiresAt);
    const now = new Date();

    if (expiresAt < now) {
      return res.status(401).json({
        success: false,
        message: "OTP expired. Please request a new one",
      });
    }
    await OTP.findByIdAndDelete(userOTP._id);

    const hashedPassword = await bcrypt.hash(
      user.password,
      10
    );

    user.password = hashedPassword;

    await User.create(user);

    const verifiedUser = await User.findOne({
      email: user.email,
      username: user.username,
    });

    const modifiedUser = lodash.pick(verifiedUser, [
      "_id",
      "username",
      "email",
      "phone",
      "role",
    ]);

    res.status(200).json({
      otpVerified: true,
      success: true,
      message: "OTP verified successfully",
      user: modifiedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    console.log(error);
  }
}

async function resendOTP(req, res) {
  const { email } = req.body;
  try {
    const userOTP = await OTP.findOne({ email });
    const newOtp = cryptoRandomString({
      length: 6,
      type: "numeric",
    });
    userOTP.otp = newOtp;
    userOTP.expiresAt = Date.now() + 3600000; // 1 hour
    await sendEmail(email, newOtp);
    await userOTP.save();
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    console.log(error);
  }
}

async function resetPassword(req, res) {
  const { email } = req.body;

  const errors = validate({ email }, "forgot-password");

  if (errors.length) {
    return res
      .status(400)
      .json({ success: false, message: errors[0] });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const otpExists = await OTP.findOne({ email });

    if (otpExists) {
      return res.status(200).json({
        success: true,
        message: "OTP already sent",
      });
    }

    const otp = cryptoRandomString({
      length: 6,
      type: "numeric",
    });

    if (new Date(otpExists?.expiresAt) < Date.now()) {
      await OTP.findOneAndUpdate(
        {
          email,
        },
        {
          otp,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
        { new: true }
      );
    }

    const resetOtp = new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    await sendEmail(email, otp);
    await resetOtp.save();

    res.status(200).json({
      success: true,
      message: "Password reset link sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    console.log(error);
  }
}

async function verifyResetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  const userOTP = await OTP.findOne({
    email,
  });

  if (!userOTP) {
    return res
      .status(404)
      .json({ success: false, message: "OTP not found" });
  }

  if (userOTP.otp !== otp) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid OTP" });
  }

  const expiresAt = new Date(userOTP.expiresAt);
  const now = new Date();

  if (expiresAt < now) {
    return res.status(401).json({
      success: false,
      message: "OTP expired. Please request a new one",
    });
  }
  await OTP.findByIdAndDelete(userOTP._id);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    {
      email,
    },
    {
      password: hashedPassword,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
}

export {
  createUser,
  deleteUser,
  editUser,
  getUsers,
  verifyOTP,
  resendOTP,
  resetPassword,
  verifyResetPassword,
};
