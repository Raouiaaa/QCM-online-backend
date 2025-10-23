import { createUser, findUserByUsername, findUserByEmail, updateUserScoreById} from '../services/userService.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const addUser = async (req, res) => {
    const saltRounds = 10;

    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required." });
        }

        // Check if the username already exists
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // check if the email already exists
        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await createUser(username, email, hashedPassword);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed adding a new user." });
    }
};


export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const existingUser = await findUserByUsername(username);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // sign JWT
    const token = jwt.sign(
      { id: existingUser.id, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Return token + safe user shape
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: {
        user: {
          id: existingUser.id,
          username: existingUser.username,
          score: existingUser.score ?? 0
        },
        token
      }
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    return res.status(500).json({ error: err.message, message: "Internal server error" });
  }
};


export const updateScore = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { score } = req.body || {};

    if (!Number.isInteger(id) || !Number.isInteger(score) || score < 0) {
      return res.status(400).json({ error: "Invalid id or score" });
    }

    const user = await updateUserScoreById(id, score);
    if (!user) return res.status(404).json({ error: "User not found" });

    // return safe shape
    return res.json({ success: true, data: { user: { id: user.id, username: user.username, email: user.email, score: user.score } } });
  } catch (err) {
    console.error("updateScore error:", err);
    return res.status(500).json({ error: "Failed to update score" });
  }
};
