import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import lodash from "lodash";

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // 1 day
      }
    );
    res.cookie("token", token, { httpOnly: true });
    const loggedInUser = lodash.pick(user, [
      "_id",
      "username",
      "email",
      "phone",
      "role",
      "profilePic",
    ]);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: loggedInUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    console.log(error);
  }
}
function logout(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    console.log(error);
  }
}

export { login, logout };
