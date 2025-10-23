import express from "express";
import {addUser, loginUser, updateScore} from "../controllers/userController.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.post("/", addUser);
router.post("/login", loginUser);
router.patch("/:id/score", auth, updateScore);

export default router;