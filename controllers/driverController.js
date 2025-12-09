import Bus from "../models/Bus.js"

export const driverLogin = async (req, res) => {
  try {
    const { busNumber } = req.body;
    const bus = await Bus.findOne({ busNumber });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }
    res.json({ success: true, busNumber: bus.busNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const driverLocation =  async (req, res) => {
    try{
        const {busNumber, lat, lng} = req.body;
        req.app.get("io").emit("busLoactionUpdate", {busNumber, lat, lng} );
        res.json({success:true});
    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: "Server error"});
    }
}