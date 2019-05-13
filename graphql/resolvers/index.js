const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Family = require("../../models/Family");
const { transformUser, transformFamily, transformTask } = require("./loaders");
const { PubSub } = require("apollo-server");
const Task = require("../../models/Task");
const TASK_REFRESH = "TASK_REFRESH";
const pubsub = new PubSub();
const resolvers = {
  Query: {
    login: async (parent, { email, password }) => {
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
    user: async (parent, { email }, req) => {
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
    getUserById: async (parent, { id }, req) => {
      try {
        // if (!req.isAuth) {
        //   throw new Error("Unauthenticated!");
        // }
        const user = await User.findById(id);
        return transformUser(user);
      } catch (err) {
        throw err;
      }
    },
    getFamilyTasks: async (parent, { familyID }) => {
      try {
        const tasks = await Task.find({ family: familyID });
        return tasks.map(task => {
          return transformTask(task);
        });
      } catch (err) {
        throw err;
      }
    }
  },
  Mutation: {
    createUser: async (parent, args) => {
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
    joinToFamily: async (parent, { userID, pin }) => {
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
    },
    bookTask: async (parent, { taskID, executorID }) => {
      try {
        let task = await Task.findById(taskID);
        if (task.executor) {
          throw new Error("Zadanie już jest przypisane");
        }
        task = await Task.findByIdAndUpdate(
          taskID,
          { executor: executorID },
          { new: true }
        );
        await pubsub.publish(TASK_REFRESH, { taskRefreshed: true });
        return transformTask(task);
      } catch (err) {
        throw err;
      }
    },
    deleteTask: async (parent, { taskID }) => {
      try {
        const task = await Task.findByIdAndDelete(taskID);
        await pubsub.publish(TASK_REFRESH, { taskRefreshed: true });
        return true;
      } catch (err) {
        throw err;
      }
    },
    finishedTask: async (parent, { taskID }) => {
      try {
        const updatedTask = await Task.findByIdAndUpdate(
          taskID,
          { toAccept: true },
          { new: true }
        );
        await pubsub.publish(TASK_REFRESH, { taskRefreshed: true });
        return transformTask(updatedTask);
      } catch (err) {
        throw err;
      }
    },
    acceptTask: async (parent, { taskID, familyID, userID }) => {
      try {
        const family = await Family.findById(familyID);
        const toFinished = family.members.length - 1;
        const task = await Task.findById(taskID);
        task.accepted.push(userID);
        if (task.accepted.length >= toFinished) {
          task.finished = true;
        }
        task.save();
        await pubsub.publish(TASK_REFRESH, { taskRefreshed: true });
        return transformTask(task);
      } catch (err) {
        throw err;
      }
    },
    createTask: async (parent, args) => {
      const { title, points, deadline, familyID } = args.taskInput;
      const task = new Task({
        title,
        points: +points,
        deadline: deadline,
        family: familyID
      });
      try {
        const createdTask = await task.save();
        const transformedTask = transformTask(createdTask);
        await pubsub.publish(TASK_REFRESH, { taskRefreshed: true });
        return transformedTask;
      } catch (err) {
        throw err;
      }
    }
  },
  Subscription: {
    taskRefreshed: {
      subscribe: () => {
        console.log("taskRefreshSub");
        return pubsub.asyncIterator([TASK_REFRESH]);
      }
    }
  }
};

module.exports = resolvers;
