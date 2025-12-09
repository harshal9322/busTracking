import express from "express";
import { addBus, getBuses, deleteBus, getDashboard, adminLogin, liveTracking} from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/login", (req, res) =>{
    res.render("adminLogin",{error:null});
});
router.post("/login", adminLogin);
router.get("/dashboard", authMiddleware, getDashboard);
router.post("/bus", authMiddleware, addBus);
router.get("/bus", authMiddleware, getBuses);
router.delete("/bus/:id", authMiddleware, deleteBus);
router.get("/bus/location/:id", authMiddleware, liveTracking);

export default router;
