import Bus from "../models/Bus.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.render("adminLogin", { error: "admin not find" });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.render("adminLogin", { error: "Invalid credential" });

    const token = jwt.sign({ id: admin._id, role:"admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token,{
     httpOnly: true,
      secure:  process.env.NODE_ENV === "production", 
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1day 
    });
    res.redirect("/api/admin/dashboard");
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
export const getDashboard = async (req, res) => {
  const buses = await Bus.find();
  res.render("dashboard", { buses})
  
}
export const addBus = async (req, res) => {
  try {
    const {driverName, busNumber, route} = req.body;
    const bus = new Bus({
      driverName, busNumber, route
    });
    await bus.save();
    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ msg: "Bus deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const liveTracking = async (req,res) => {
  try{
    const id = req.params.id;
    const bus = await Bus.findById(id);
    if(!bus) return res.status(404).send("bus not found");
    res.render("liveTracking", { bus });
  }catch(err){
   console.error(err);
   res.status(500).send("server error");
  }
}
