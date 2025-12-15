import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  from: {type:String, required:true},
  to:{type:String, required:true},
  currentLocation:{
    lat:{type:Number, default:0},
    lng:{type:Number, default:0}
  }
}, { timestamps: true });

export default mongoose.model("Bus", busSchema);
