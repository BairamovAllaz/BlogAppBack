const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const [existingUser] = await pool.query(
      `SELECT * FROM user WHERE firstName=? OR lastName=? OR email=?`,
      [firstName, lastName, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).send({ message: "user already exsist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO user (firstName, lastName,email,password) VALUES (?, ?, ?,?)",
      [firstName, lastName, email, hashedPassword]
    );
    res.status(201).json({ firstName, lastName, email, password });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while signup" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const [user] = await pool.query(`SELECT * FROM user WHERE email=?`, [
      email,
    ]);
    console.log(user);
    if (user.length === 0) {
      return res.status(400).send({ message: "User doesnt exsist" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    console.log("Ismatch" + isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      "Bairamovi",
      { expiresIn: "1h" }
    );
    console.log("Token: " , token);
    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while signup" });
  }
};

const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

const loginWithGoogle = async (req, res) => {
  console.log("Received Body:", req.body);
  const { firstName, lastName, email } = req.body;
  console.log(firstName, " ", lastName, " ", email);
  const password = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const [user] = await pool.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      const [result] = await pool.query(
        "INSERT INTO user (firstName, lastName,email,password) VALUES (?, ?, ?,?)",
        [firstName, lastName, email, hashedPassword]
      );
      console.log("Created user", result);
      res.status(201).json({
        message: "User created successfully",
        userId: result.insertId,
      });
    } else {
      res.status(200).json({
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while logging in with Google",
      message: error.message,
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const [user] = await pool.query(
      "SELECT id, firstName, lastName, email FROM user WHERE email = ?",
      [req.user.email]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signUp, Login, loginWithGoogle, getUserData };
