import express from "express";
import { userRegister , userLogin} from "../controllers/userController.js";

const router = express.Router();

// Register
router.post("/register",userRegister);

// Login
router.post("/login", userLogin);

export default router;