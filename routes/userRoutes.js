import express from "express";
import { userRegister , userLogin, findBus} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register",userRegister);

// Login
router.post("/login", userLogin);
// find Buses
router.post("/login/buses", authMiddleware, findBus);

export default router;