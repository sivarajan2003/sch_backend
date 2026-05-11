import mongoose from "mongoose";

const sportsSchema = new mongoose.Schema(
  {
    sportId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    coach: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Sports",
  sportsSchema
);