const Task = require("../../models/Task");
const Family = require("../../models/Family");
const { transformTask } = require("./loaders");
module.exports = {
  createTask: async args => {
    const { title, points, deadline, familyID } = args.taskInput;
    const task = new Task({
      title,
      points: +points,
      deadline: deadline,
      family: familyID
    });
    try {
      const createdTask = await task.save();
      return transformTask(createdTask);
    } catch (err) {
      throw err;
    }
  },
  getFamilyTasks: async ({ familyID }) => {
    try {
      const tasks = await Task.find({ family: familyID });
      return tasks.map(task => {
        return transformTask(task);
      });
    } catch (err) {
      throw err;
    }
  },
  bookTask: async ({ taskID, executorID }) => {
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
      return transformTask(task);
    } catch (err) {
      throw err;
    }
  },
  deleteTask: async ({ taskID }) => {
    try {
      const task = await Task.findByIdAndDelete(taskID);
      return true;
    } catch (err) {
      throw err;
    }
  },
  finishedTask: async ({ taskID }) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        taskID,
        { toAccept: true },
        { new: true }
      );

      return transformTask(updatedTask);
    } catch (err) {
      throw err;
    }
  },
  acceptTask: async ({ taskID, familyID, userID }) => {
    try {
      const family = await Family.findById(familyID);
      const toFinished = family.members.length - 1;
      const task = await Task.findById(taskID);
      task.accepted.push(userID);
      if (task.accepted.length >= toFinished) {
        task.finished = true;
      }
      task.save();
      return transformTask(task);
    } catch (err) {
      throw err;
    }
  }
};
