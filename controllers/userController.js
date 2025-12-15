import User from "../models/User.js";
import Bus from '../models/Bus.js'
import bcrypt from "bcrypt";

//register
export const userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.json({ success: true, message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
}

//login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
}

// get bus
export const findBus = async (req, res) => {
    try {
        const { from, to } = req.body
        
        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: "please enter Bus Stations",
            });
        }
        const buses = await Bus.find({ from, to });
        if (buses.length === 0) {
            return res.status(404).json({ success: false, message: "Bus Not Found" });
        }
        res.status(200).json({ success: true, buses });
    } catch (err) {
        console.log('error', err);
        return req.status(500).json({ success:false, message:"Internal server error"});
    }
}