import mongoose from "mongoose";

const transportSchema =
  new mongoose.Schema(
    {
      id: String,

      route: String,

      status: String,

      date: String
    },
    {
      timestamps: true
    }
  );

export default mongoose.model(
  "Transport",
  transportSchema
);