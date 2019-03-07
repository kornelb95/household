const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  family: {
    type: Schema.Types.ObjectId,
    ref: "Family"
  }
});

module.exports = User = mongoose.model("User", userSchema);
