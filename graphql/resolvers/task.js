const Task = require("../../models/Task");
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
  }
};
