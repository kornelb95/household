const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const familySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  pin: {
    type: String,
    default: shortid.generate
  }
});

module.exports = Family = mongoose.model("Family", familySchema);
