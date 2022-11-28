
class TaskManager{
	#taskList = []; //Array that stores task objects
	
	//A status "constant" "enum": Cameron
	taskStatus () {
		return {
			todo: "To Do",
			inprogress: "In Progress",
			review: "Review",
			complete: "Complete"
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
	
	constructor(){
		//Generate 10 test cards
		for (let i = 1; i <= 10; i++) {
			//Randomize status
			let t = Math.floor(Math.random() * 4)
			t = (t >= 5) ? 4:t

			//Make task
			this.addTask(`Taskname ${i}`, `Description #${i}`, `Person ${i}`, new Date(), Object.keys(this.taskStatus())[t])
		}
		
	}

	//Returns am array of all tasks: James
	getAllTasks() {
		return this.#taskList
	}

	//Returns all tasks that are set to a given status: Declan
	getTasksWithStatus (status) {
		let newTaskList = [];
		this.#taskList.forEach(task => {
			if(task.Status === status)
				newTaskList.push(task)
		});
		return newTaskList
	}

	//Gets task by given ID: Cameron
	getTaskByID(taskID){
		let result //Holds forEach return value
		this.#taskList.forEach(task => {
			if(task.ID === taskID) {
				result = task;
				return
			}
		});
		return result;
	}

	//Adds a task with a unique ID to the taskList: Camerion
	addTask(name, description, assignedTo, dueDate, status){
		//Generates a new ID by getting length.
		let id = this.#taskList.length
		id++; //Offets so the first entry is ID = 1

		//Push new task to the array after genrating taskObj using factory function.
		this.#taskList.push(this.taskObjFactory(id, name, description, assignedTo, dueDate, status))

		//Renders the DOM
		this.render()
	}


	//Generates the HTML and renders it to the DOM: done as team ("pair" coding)
	render(){
		//Get card container
		const cardContainer = document.getElementById("content-container")

		//Wipe existing cards
		cardContainer.innerHTML = ''

		//Iterate through the taskList and render each card
		this.#taskList.forEach(task => {
			//Prepare cardElement
			let cardElement = document.createElement('li')
			cardElement.className = "list-group-item"
			cardElement.setAttribute("task-id", task.ID)

			//Create HTML card and render to DOM
			cardElement.innerHTML = this.createTaskHTML(task)
			cardContainer.appendChild(cardElement)
		})
	}

	//Generates the card HTML with data for a given taskObj */
	createTaskHTML(taskObj){
		
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
	renderOpenCard(taskObj){
		//Get elements
		const openCard = document.getElementById("open-card").setAttribute("task-id", taskObj.ID)
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
