import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Number, default: () => Date.now() },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
