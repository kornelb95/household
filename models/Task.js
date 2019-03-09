const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    executor: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    family: {
      type: Schema.Types.ObjectId,
      ref: "Family"
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = Task = mongoose.model("Task", taskSchema);
