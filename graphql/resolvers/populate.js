const DataLoader = require("dataloader");

const User = require("../../models/User");
const Family = require("../../models/Family");

const userLoader = new DataLoader(userIds => {
  return users(userIds);
});

const familyLoader = new DataLoader(familyIds => {
  return Family.find({ _id: { $in: familyIds } });
});

const users = async userIds => {
  try {
    const users = await User.find({ _id: userIds });
    return users.map(user => {
      return transformUser(user);
    });
  } catch (err) {
    throw err;
  }
};

const family = async familyId => {
  try {
    const family = await familyLoader.load(familyId.toString());
    return {
      ...family._doc,
      // _id: family.id,
      creator: () => userLoader.load(family._doc.creator.toString()),
      members: () => userLoader.loadMany(family._doc.members)
    };
  } catch (err) {
    throw err;
  }
};

const transformUser = user => {
  return {
    ...user._doc,
    // _id: user.id,
    family: family.bind(this, user.family)
  };
};

exports.transformUser = transformUser;
