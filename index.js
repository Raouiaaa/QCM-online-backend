import express from "express";
import dotenv from 'dotenv';
import userRoutes from "./src/routes/userRoutes.js";
import cors from "cors";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
