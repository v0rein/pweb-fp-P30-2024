import mongoose from "mongoose";

const roomOccupancySchema = new mongoose.Schema({
  empty: {
    type: Number,
    default: 10,
  },
  filled: {
    type: Number,
    default: 0,
  },
});

export const RoomOccupancy = mongoose.model(
  "RoomOccupancy",
  roomOccupancySchema
);
