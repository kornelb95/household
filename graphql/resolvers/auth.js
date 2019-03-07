const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Family = require("../../models/Family");
const { transformUser } = require("./populate");

module.exports = {
  createUser: async args => {
    const {
      email,
      password,
      name,
      isFamilyCreating,
      familyName
    } = args.userInput;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Użytkownik o tym adresie email już istnieje.");
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hashedPassword,
        name
      });
      let createdUser = await newUser.save();

      if (isFamilyCreating) {
        const family = new Family({
          name: familyName,
          creator: createdUser.id
        });
        const createdFamily = await family.save();
        createdUser = await User.findOneAndUpdate(
          { _id: createdFamily.creator },
          { family: createdFamily.id }
        );
      }
      return transformUser(createdUser);
    } catch (err) {
      throw err;
    }
  },
  user: async ({ email }) => {
    try {
      const user = await User.findOne({ email });
      console.log(user);
      return transformUser(user);
    } catch (err) {
      throw err;
    }
  }
};
