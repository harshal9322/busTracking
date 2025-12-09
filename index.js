import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import Bus from "./models/Bus.js";

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("io", io);

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV == "production" ? "combined" : "dev"));

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/driver", driverRoutes);

// Connect MongoDB
connectDB();

// ✅ SOCKET.IO LOGIC — Handles live tracking
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // ✅ Driver sends location updates
  socket.on("updateLocation", async ({ busNumber, lat, lng }) => {
    console.log("📍 Received location update:", busNumber, lat, lng);

    try {
      // Save location in DB
      const bus = await Bus.findOneAndUpdate(
        { busNumber },
        { currentLocation: { lat, lng } },
        { new: true }
      );

      if (bus) {
        console.log("📡 Emitting update to clients:", { busNumber, lat, lng });

        // ✅ Broadcast update to all connected clients (admin dashboards)
        io.emit("busLocationUpdated", { busNumber, lat, lng });
      } else {
        console.warn(`⚠️ Bus not found for number: ${busNumber}`);
      }
    } catch (err) {
      console.error("❌ Error updating location:", err);
    }
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
