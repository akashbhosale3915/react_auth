import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);
