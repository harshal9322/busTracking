import express from "express";
import { driverLogin, driverLocation} from "../controllers/driverController.js";

const router = express.Router();

// Driver login
router.post("/login",driverLogin );
router.post("/location", driverLocation);

export default router;
