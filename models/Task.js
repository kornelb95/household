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
    executor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
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
