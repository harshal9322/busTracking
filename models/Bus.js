import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  route: {type:String},
  currentLocation:{
    lat:{type:Number, default:0},
    lng:{type:Number, default:0}
  }
}, { timestamps: true });

export default mongoose.model("Bus", busSchema);
