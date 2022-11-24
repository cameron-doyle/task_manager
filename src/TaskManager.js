
class TaskManager{
	/* Array that stores task objects (easy): Cameron */
	#taskList = [];

	/* Use a factory function for the object creation (Hard): Cameron */
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
		//Do stuff in future
	}


	/* getAllTasks(): (easy): James */
	/* returns a list (array) of all tasks */

	/* getTasksWithStatus(status) (Hard): Declan */
	/* returns a list (array) of all tasks where a status is equal to the status passes as an argument */

	/* addTask(name, etc) (Medium): Cameron */
	/* Add a task to existing taks list (array)*/
	/* task argument is a product of taskObjFactory */
	/* TASK 7: call render() method */
	addTask(name, description, assignedTo, dueDate, status){
		let id = this.#taskList.length
		//id = (id <= 0) ? 1:id;
		//id ??= 1;
		//Bad code, just do length + 1
		id++;
		this.#taskList.push(this.taskObjFactory(id, name, description, assignedTo, dueDate, status))
		this.render()
	}


	/* TASK 7: done as team */
	/* render() */
	/* Render both calls the createTaskHTML and displays to DOM */
	/* Loop through aray and call createTaskHTML for each object and pass object, the add child to card container */
	/* ul ID: content-container */
	render(){
		//Get card container
		const cardContainer = document.getElementById("content-container")
		cardContainer.innerHTML = '' //Wipe existing cards

		this.#taskList.forEach(task => {
			//Prepare cardElement
			let cardElement = document.createElement('li')
			cardElement.className = "list-group-item"
			cardElement.id = `task_${task.ID}`

			//Create HTML card and append to ul
			cardElement.innerHTML = this.createTaskHTML(task)
			cardContainer.appendChild(cardElement)
		})
	}

	/* createTaskHTML */
	/* Takes an JSON object as an argument and spits out a card html with data */
	createTaskHTML(taskObj){
		//Html template literals
		let date = taskObj.DueDate;
		return `<div class="card" data-bs-toggle="modal" data-bs-target="#open-card">
				<div class="card-header">
					<h3>${taskObj.Name}</h3>
					<p>${taskObj.AssignedTo}</p>
				</div>
				<div class="card-body">
					<p>${taskObj.Description}</p>
				</div>

				<div class="card-footer">
					<h5>${taskObj.Status}</h5>
					<p>${ //Due Date
						//Prepends a 0 if the day is less than 10.
						(date.getDay() < 10) ? `0${date.getDay()}` : date.getDay()
						}/${
						//Prepends a 0 if month is less than 10
						(date.getMonth() < 10) ? `0${date.getMonth()}` : date.getMonth()
						}/${date.getFullYear()}</p>
				</div>
			</div>`
	}
}
