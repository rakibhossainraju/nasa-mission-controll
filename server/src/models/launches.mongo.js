import * as mongoose from "mongoose";

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  destination: {
    type: String,
  },
  customers: {
    type: [String],
    required: true,
  },
  upcoming: {
    type: Boolean,
    default: true,
    required: true,
  },
  success: {
    type: Boolean,
    default: true,
    required: true,
  },
});
export default mongoose.model("Launch", launchesSchema);
