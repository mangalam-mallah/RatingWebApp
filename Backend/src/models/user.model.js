import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return true;
        },
      },
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER", "STORE_OWNER"],
      default: "USER",
    },
    address: {
      type: String,
      maxlength: 400,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
