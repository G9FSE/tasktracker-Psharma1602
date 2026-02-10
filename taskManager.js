const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "tasks.json");

// Load tasks
function loadTasks() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

// Save tasks
function saveTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Generate ID
function generateId(tasks) {
    return tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
}

const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

let tasks = loadTasks();

switch (command) {

    case "add":
        if (!arg1) {
            console.log("Please provide task description");
            break;
        }
        const newTask = {
            id: generateId(tasks),
            description: arg1,
            status: "todo"
        };
        tasks.push(newTask);
        saveTasks(tasks);
        console.log("Task added:", newTask);
        break;

    case "update":
        const idToUpdate = parseInt(arg1);
        const newDesc = arg2;

        const taskToUpdate = tasks.find(t => t.id === idToUpdate);
        if (!taskToUpdate) {
            console.log("Task not found");
            break;
        }

        taskToUpdate.description = newDesc;
        saveTasks(tasks);
        console.log("Task updated:", taskToUpdate);
        break;

    case "delete":
        const idToDelete = parseInt(arg1);
        tasks = tasks.filter(t => t.id !== idToDelete);
        saveTasks(tasks);
        console.log("Task deleted");
        break;

    case "mark":
        const idToMark = parseInt(arg1);
        const status = arg2; // todo / in-progress / done

        const taskToMark = tasks.find(t => t.id === idToMark);
        if (!taskToMark) {
            console.log("Task not found");
            break;
        }

        taskToMark.status = status;
        saveTasks(tasks);
        console.log("Task updated:", taskToMark);
        break;

    case "list":
        if (!arg1) {
            console.log(tasks);
        } else {
            const filtered = tasks.filter(t => t.status === arg1);
            console.log(filtered);
        }
        break;

    default:
        console.log(`
Available commands:
add "task"
update id "new task"
delete id
mark id status (todo/in-progress/done)
list
list done
list todo
list in-progress
        `);
}
