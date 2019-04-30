const DataLoader = require("dataloader");

const User = require("../../models/User");
const Family = require("../../models/Family");
const Task = require("../../models/Task");

const userLoader = new DataLoader(userIds => {
  return userBatch(userIds);
});

const familyLoader = new DataLoader(familyIds => {
  return Family.find({ _id: { $in: familyIds } });
});

const userBatch = async userIds => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
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
  return {
    ...user._doc,
    _id: user.id,
    family: user.family === null ? null : family.bind(this, user.family)
  };
};
const transformFamily = family => {
  return {
    ...family._doc,
    _id: family.id,
    creator: () => userLoader.load(family._doc.creator.toString()),
    members: () =>
      userLoader.loadMany(family._doc.members.map(member => member.toString()))
  };
};
const transformTask = task => {
  return {
    ...task._doc,
    _id: task.id,
    deadline: new Date(task.deadline).toISOString(),
    executor: () =>
      task._doc.executor === null
        ? null
        : userLoader.load(task._doc.executor.toString()),
    family: family.bind(this, task.family),
    createdAt: new Date(task.createdAt).toISOString(),
    updatedAt: new Date(task.updatedAt).toISOString(),
    accepted: () =>
      userLoader.loadMany(task._doc.accepted.map(accept => accept.toString()))
  };
};
exports.transformUser = transformUser;
exports.transformFamily = transformFamily;
exports.transformTask = transformTask;
