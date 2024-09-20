//initialize node project npm init
// create tasks json file with sampletasks
// use fs module for file handiling

//getAllTasks - reads json async - return array and handle error - DONE
//listTasks - retrieves tasks with git all task -- format clearly with title and status - DONE
//addTask - title and description param, default not completed status - async update - DONE
//completeTask - title as param - search and update
//CLI interface for users

//import modules
const path = require("node:path");
const fs = require("node:fs/promises");
const readline = require("node:readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

//gets tasks
async function getAllTasks() {
	try {
		const json = await fs.readFile(path.join(__dirname, "tasks.json"), "utf-8");
		const tasks = JSON.parse(json);
		return tasks;
	} catch (err) {
		console.log("Cannot get tasks \n" + err);
	}
}

//lists tasks - title and status
async function listTasks() {
	try {
		const tasks = await getAllTasks();
		// console.log(typeof tasks);
		for (let i = 0; i < tasks.length; i++) {
			//not eloquent but it'll do
			console.log(tasks[i].title + "\t\t" + tasks[i].status);
		}
	} catch (err) {
		console.log("Cannot list tasks \n" + err);
	}
}

//add new task - prm is title and description
// since i'm manipulating an array inside the json....i actually cannot APPEND the file, i need to retrieve the array, push to it, then write over the json file
async function addTask(title, desc) {
	try {
		const tasks = await getAllTasks();
		const element = {
			title: title,
			description: desc,
			status: "not completed",
		};
		tasks.push(element);
		const content = JSON.stringify(tasks);
		await fs.writeFile(path.join(__dirname, "tasks.json"), content);
	} catch (err) {
		console.log("Cannot add tasks \n" + err);
	}
}

//addTask("scoop litter", "scoop litter");

//complete tasks - title as param
async function completeTask(title) {
	try {
		const tasks = await getAllTasks();
		for (let i = 0; i < tasks.length; i++) {
			//not eloquent but it'll do
			if (tasks[i].title == title) {
				tasks[i].status = "completed";
				console.log("TASK COMPLETED: " + tasks[i].title);
			}
		}
		const content = JSON.stringify(tasks);
		await fs.writeFile(path.join(__dirname, "tasks.json"), content);
	} catch (err) {
		console.log("Cannot mark task completed \n" + err);
	}
}

// CLI interface - got a lot of help on readline from https://www.youtube.com/watch?v=jXaBeZ19RB4
// I want to prompt the user to make choices and call fxns appropriately
// Logically, I want the program to remain open/prompt until a user exits
// I also want to sanitize inputs -- for title and desc I want to be sure they're not null

const prompt =
	"Welcome to the task manager. \n Type the number of the action you wish to take OR type EXIT to close the program. \n 1. List Tasks \n 2. Add A New Task \n 3. Mark Task as Completed \n";
console.log(prompt);

rl.on("line", function (answer) {
	if (answer.toUpperCase().trim() === "EXIT") {
		rl.close();
	} else if (answer.trim() == 1) {
		console.log("***\t\tTASKMANAGER\t\t***");
		listTasks();
	} else if (answer.trim() == 2) {
		rl.question("What is the title of the task?", function (titleansw) {
			rl.question(
				"What is the description of the task?",
				function (descanswer) {
					if (titleansw && descanswer) {
						addTask(titleansw, descanswer);
					} else {
						console.log("Titles and descriptions must be valid strings.");
					}
				}
			);
		});
	} else if (answer.trim() == 3) {
		rl.question("What is the title of the task? ", function (titleansw) {
			if (titleansw) {
				completeTask(titleansw);
			}
		});
	}
});
