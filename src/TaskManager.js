class TaskManager {
	#taskList = []; //Array that stores task objects
	static #storageKey = "DJC_Task_Manager_Generation";


	//A status "constant" "enum": Cameron
	taskStatus() {
		return {
			todo: "To Do",
			inprogress: "In Progress",
			review: "Review",
			complete: "Done"
		}
	}


	//A factory function for the task object creation: Cameron
	taskObjFactory(id, name, description, assignedTo, dueDate, status) {
		return {
			ID: id,
			Name: name,
			Description: description,
			AssignedTo: assignedTo,
			DueDate: dueDate,
			Status: status
		}
	}


	//Loads from localStorage and renders: Cameron
	constructor() {
		this.loadFromStorage()
		this.render()
	}


	//Returns am array of all tasks: James
	getAllTasks() {
		return this.#taskList
	}


	//Returns all tasks that are set to a given status: Declan
	getTasksWithStatus(status) {
		let newTaskList = [];
		this.#taskList.forEach(task => {
			if (task.Status === status)
				newTaskList.push(task)
		});
		return newTaskList
	}


	//Gets task by given ID: Cameron
	getTaskByID(taskID) {
		/* let result //Holds forEach return value
		this.#taskList.forEach(task => {
			if(task.ID === taskID) {
				result = task;
				return
			}
		}); */

		//Filter, than return single taskObj
		const r = this.#taskList.filter(task => task.ID === taskID)
		return (r != null && r.length > 0) ? r[0] : null
	}


	//Adds a task with a unique ID to the taskList: Camerion
	addTask(name, description, assignedTo, dueDate, status) {
		//Generates a new ID by getting length.
		let id
		//If there is an task in the taskList, grab the last entry and make id = the incremented id of lastTask
		if (this.#taskList.length > 0) {
			const lastTask = this.#taskList[this.#taskList.length - 1]; //Get last task in the array
			id = lastTask.ID + 1;
		} else {
			id = 1;
		}

		//Push new task to the array after genrating taskObj using factory function.
		this.#taskList.push(this.taskObjFactory(id, name, description, assignedTo, dueDate, status))
		const stringData = JSON.stringify(this.#taskList);

		//Renders the DOM
		this.render()
	}


	//Updates the task and saves it to localStorage: James
	updateTask(taskObj) {
		this.#taskList.forEach(task => {
			if (task.ID === taskObj.ID) {
				task = taskObj
				return
			}
		});
		this.render()
	}


	//Delete a task and saves it to localStorage: Declan
	deleteTask(taskObj) {
		this.#taskList = this.#taskList.filter(task => taskObj.ID !== task.ID) //Filter taskList

		//Update DOM
		this.render()
	}


	//Saves tasks to localStorage: Cameron
	saveToStorage() {
		//Serialize the taskList
		const tasksSerial = JSON.stringify(this.#taskList)
		//Get existing localStorage serialized data
		const existingStorage = localStorage.getItem(TaskManager.#storageKey)

		//If the existingStorage is outdated, update it
		if (existingStorage !== tasksSerial) {
			localStorage.setItem(TaskManager.#storageKey, tasksSerial)
		}
	}


	//Loads tasks from localStorage: Cameron
	loadFromStorage() {
		const tasks = JSON.parse(localStorage.getItem(TaskManager.#storageKey),)

		//Convert DueDate from string to DateObj (JSON serialization doesn't convert it back)
		this.#taskList = tasks.map((task) => {
			task.DueDate = new Date(task.DueDate)
			return task
		})
	}


	//Generates the HTML and renders it to the DOM: done as team ("pair" coding)
	render() {
		//Get card container
		const cardContainer = document.getElementById("content-container")

		//Iterate through the taskList and render each card
		if (this.#taskList.length > 0) {
			//Wipe existing cards
			cardContainer.innerHTML = ''

			this.#taskList.forEach(task => {
				//Prepare cardElement
				let cardElement = document.createElement('li')
				cardElement.className = "list-group-item"
				cardElement.setAttribute("task-id", task.ID)

				//Create HTML card and render to DOM
				cardElement.innerHTML = this.createTaskHTML(task)
				cardContainer.appendChild(cardElement)
			})
		} else {
			//TODO: render tutorial page
			//cardContainer.innerHTML = `<p>Welcome!</p>`
		}

		this.saveToStorage()
	}


	//Generates the card HTML with data for a given taskObj: Cameron
	createTaskHTML(taskObj) {

		//Formats status to be consistent with the "add task" form
		let status = this.taskStatus()[taskObj.Status];
		//TODO: sort task by due date

		//Inject and format data into card html and return.
		return `<div class="card" data-bs-toggle="modal" data-bs-target="#open-card">
				<div class="card-header">
					<h3>${taskObj.Name}</h3>
					<p>${taskObj.AssignedTo}</p>
				</div>
				<div class="card-body">
					<p>${taskObj.Description}</p>
				</div>

				<div class="card-footer">
					<h5>${status}</h5>
					<p>${ //Due Date
			//Prepends a 0 if the day is less than 10.
			(taskObj.DueDate.getDate() < 10) ? `0${taskObj.DueDate.getDate()}` : taskObj.DueDate.getDate()
			}/${
			//Prepends a 0 if month is less than 10
			(taskObj.DueDate.getMonth() + 1 < 10) ? `0${taskObj.DueDate.getMonth() + 1}` : taskObj.DueDate.getMonth() + 1
			}/${taskObj.DueDate.getFullYear()}</p>
				</div>
			</div>`
	}


	//Renders the open card: Cameron
	renderOpenCard(taskObj) {
		//Get elements
		document.getElementById("open-card").setAttribute("task-id", taskObj.ID)
		const taskName = document.getElementById("open-card-title")
		const ddat = document.getElementById("open-card-duedate-assignedto") //Merged into one element
		const description = document.getElementById("open-card-description")
		const status = document.getElementById("opencard-status")

		//Set data
		taskName.textContent = taskObj.Name
		ddat.textContent = `${taskObj.AssignedTo} - ${taskObj.DueDate.getDate()}/${taskObj.DueDate.getMonth() + 1}/${taskObj.DueDate.getFullYear()}`
		description.textContent = taskObj.Description
		status.value = taskObj.Status
	}
}
