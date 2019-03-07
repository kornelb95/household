const DataLoader = require("dataloader");

const User = require("../../models/User");
const Family = require("../../models/Family");

const userLoader = new DataLoader(userIds => {
  console.log(userIds);
  return userBatch(userIds);
});

const familyLoader = new DataLoader(familyIds => {
  return Family.find({ _id: { $in: familyIds } });
});

const userBatch = async userIds => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    console.log(users);
    users.sort((a, b) => {
      return (
        userIds.indexOf(a._id.toString()) - userIds.indexOf(b._id.toString())
      );
    });
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
    console.log(family._doc.members);
    return {
      ...family._doc,
      _id: family.id,
      creator: () => userLoader.load(family._doc.creator.toString()),
      members: () => userLoader.loadMany(family._doc.members)
    };
  } catch (err) {
    throw err;
  }
};

const transformUser = user => {
  console.log("tu");
  return {
    ...user._doc,
    _id: user.id,
    family: family.bind(this, user.family)
  };
};

exports.transformUser = transformUser;
