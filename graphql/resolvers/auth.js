const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Family = require("../../models/Family");
const { transformUser, transformFamily } = require("./loaders");

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
        name,
        family: null
      });
      const createdUser = await newUser.save();

      if (isFamilyCreating) {
        const existingFamily = await Family.findOne({
          creator: createdUser.id
        });
        if (existingFamily) {
          throw new Error("Już założyłeś rodzinę");
        }
        const family = new Family({
          name: familyName,
          creator: createdUser.id,
          members: [createdUser.id]
        });
        const createdFamily = await family.save();
        const updatedUser = await User.findByIdAndUpdate(
          createdFamily.creator,
          { family: createdFamily.id },
          { new: true }
        );
        return transformUser(updatedUser);
      }
      return transformUser(createdUser);
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Nieprawidłowe dane logowania");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Nieprawidłowe dane logowania");
    }
    let userFamily = null;
    if (user.family !== null) {
      userFamily = await Family.findById(user.family);
    }
    const token = await jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name
      },
      require("../../config/keys").secret,
      {
        expiresIn: "1h"
      }
    );
    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
      family: userFamily ? transformFamily(userFamily) : null
    };
  },
  user: async ({ email }, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findOne({ email });
      return transformUser(user);
    } catch (err) {
      throw err;
    }
  },
  getUserById: async ({ id }, req) => {
    try {
      // if (!req.isAuth) {
      //   throw new Error("Unauthenticated!");
      // }
      const user = await User.findById(id);
      return transformUser(user);
    } catch (err) {
      throw err;
    }
  }
};
