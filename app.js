const fs = require("fs");
const path = require("path");
const readline = require("readline");

const tasksFilePath = path.join(__dirname, "tasks.json");

// Ensure the tasks file exists
if (!fs.existsSync(tasksFilePath)) {
  fs.writeFileSync(tasksFilePath, JSON.stringify([]));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const loadTasks = () => {
  const data = fs.readFileSync(tasksFilePath);
  return JSON.parse(data);
};

const saveTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

const addTask = (taskDescription) => {
  const tasks = loadTasks();
  tasks.push({ description: taskDescription, completed: false });
  saveTasks(tasks);
  console.log("Task added successfully.");
  rl.close();
};

const viewTasks = () => {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log("No tasks available.");
  } else {
    tasks.forEach((task, index) => {
      console.log(
        `${index + 1}. [${task.completed ? "x" : " "}] ${task.description}`
      );
    });
  }
  rl.close();
};

const markTaskAsComplete = (taskIndex) => {
  const tasks = loadTasks();
  if (taskIndex < 1 || taskIndex > tasks.length) {
    console.log("Invalid task number.");
  } else {
    tasks[taskIndex - 1].completed = true;
    saveTasks(tasks);
    console.log("Task marked as complete.");
  }
  rl.close();
};

const removeTask = (taskIndex) => {
  const tasks = loadTasks();
  if (taskIndex < 1 || taskIndex > tasks.length) {
    console.log("Invalid task number.");
  } else {
    tasks.splice(taskIndex - 1, 1);
    saveTasks(tasks);
    console.log("Task removed.");
  }
  rl.close();
};

const main = () => {
  rl.question(
    "Choose an action: (1) Add Task, (2) View Tasks, (3) Mark Task as Complete, (4) Remove Task: ",
    (action) => {
      switch (action) {
        case "1":
          rl.question("Enter task description: ", (taskDescription) => {
            addTask(taskDescription);
          });
          break;
        case "2":
          viewTasks();
          break;
        case "3":
          rl.question(
            "Enter task number to mark as complete: ",
            (taskNumber) => {
              markTaskAsComplete(parseInt(taskNumber));
            }
          );
          break;
        case "4":
          rl.question("Enter task number to remove: ", (taskNumber) => {
            removeTask(parseInt(taskNumber));
          });
          break;
        default:
          console.log("Invalid action.");
          rl.close();
          break;
      }
    }
  );
};

main();
