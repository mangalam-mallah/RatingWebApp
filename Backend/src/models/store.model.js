import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  address: {
    type: String,
    maxlength: 400
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);
