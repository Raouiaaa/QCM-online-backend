import { createUser, findUserByUsername, findUserByEmail} from '../services/userService.js';
import bcrypt from 'bcrypt';


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

        // Check if the user exists
        const existingUser = await findUserByUsername(username);

        // Check if user doesn't exist
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // check if passwords matches
        const match = await bcrypt.compare(password, existingUser.password);

        if (match) {
            res.status(200).json({
                success: true,
                message: "Authentication successful",
                data: {
                    user: {
                        id: existingUser.id,
                        username: existingUser.username,
                        score: existingUser.score,
                    },
                },
            });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (err) {
        console.error("Error in loginUser:", err);
        res.status(500).json({ error: err.message , message: "We're encoutring an internal server error. Please try again later" });
    }
}
