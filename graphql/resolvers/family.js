const Family = require("../../models/Family");
const User = require("../../models/User");
const { transformFamily } = require("./loaders");
module.exports = {
  joinToFamily: async ({ userID, pin }) => {
    try {
      const family = await Family.findOne({ pin });
      const members = family.members;
      isMember = members.indexOf(userID);
      if (isMember !== -1) {
        throw new Error("Uzytkownik jest już w tej rodzinie");
      }
      members.push(userID);
      const updatedFamily = await Family.findByIdAndUpdate(
        family.id,
        { members },
        { new: true }
      );
      const user = await User.findByIdAndUpdate(
        userID,
        { family: updatedFamily.id },
        { new: true }
      );
      return transformFamily(updatedFamily);
    } catch (err) {
      throw err;
    }
  }
};
