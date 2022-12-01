console.log("Script loaded");

window.addEventListener('DOMContentLoaded', () => {
	updateTime() //Update clock so it's not "Loading" for an entire second while the setInterval loads up.
	const tm = new TaskManager()

	//Marks the task as done: James
	document.getElementById("btn-opencard-mark").addEventListener("click", (e) => {
		//Get taskID from HTML and get taskObj
		const taskID = Number(document.getElementById("open-card").getAttribute("task-id"))
		const taskObj = tm.getTaskByID(taskID);

		//Set status to complete/done
		taskObj.Status = Object.keys(TaskManager.taskStatus())[3]

		tm.updateTask(taskObj)

		//Set status dropdown to complete/done
		document.getElementById("opencard-status").value = Object.keys(TaskManager.taskStatus())[3]

		//Swaps and disables buttons if needed
		updateOpenCardButtons()
	})

	//Updates the task: Cameron
	document.getElementById("btn-opencard-update").addEventListener("click", (e) => {
		const taskID = Number(document.getElementById("open-card").getAttribute("task-id"))

		//Get taskObj and update status from the form.
		const taskObj = tm.getTaskByID(taskID)
		taskObj.Status = document.getElementById("opencard-status").value

		tm.updateTask(taskObj)

		//Swaps and disables buttons if needed
		updateOpenCardButtons()
	})

	//Deletes the task: Declan
	document.getElementById("opencard-delete").addEventListener("click", (e) => {
		//Get task id from HTML and deletes
		const taskID = Number(document.getElementById("open-card").getAttribute("task-id"))
		const taskObj = tm.getTaskByID(taskID);
		tm.deleteTask(taskObj)
	})


	//Generates some test cards on title click: Cameron
	document.getElementById("nav-title-container").addEventListener("click", e => {
		for (let i = 1; i <= 10; i++) {
			//addTask(name, description, assignedTo, dueDate, status) {
			const ranDescription = (Math.floor(Math.random() * 100) >= 50) ? true:false // 25% chance of a long description

			//random index for status
			let statusIndex = Math.floor(Math.random() * 4)
			statusIndex = (statusIndex > 3) ? 3:statusIndex
			const status = Object.keys(TaskManager.taskStatus())[statusIndex];
			//Generate task
			tm.addTask(
				`Test Task #${i}`,
				(ranDescription) ?
				`Test Task Long Description #${i}\nLorem ipsum dolor sit amet consectetur adipisicing elit. Ab vitae iusto expedita iure id aliquam corporis amet aliquid esse fugit earum voluptatem quasi eos nesciunt neque cum quae vel magni quibusdam, eligendi numquam. Nostrum iure totam ab dolore adipisci laboriosam natus dolorem vel doloribus facilis! Nulla, laborum quae nihil facere perferendis, totam necessitatibus consequatur quidem veniam, voluptate eius reprehenderit ea? Expedita, impedit excepturi eveniet eum voluptatibus, dicta repellat qui officiis similique eligendi illum. Nostrum blanditiis sunt eaque vitae accusamus esse, laboriosam corrupti reiciendis dolorum nihil odit, rem harum nulla, asperiores reprehenderit itaque aliquam adipisci! Deleniti tenetur quaerat eaque ex sequi.Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab vitae iusto expedita iure id aliquam corporis amet aliquid esse fugit earum voluptatem quasi eos nesciunt neque cum quae vel magni quibusdam, eligendi numquam. Nostrum iure totam ab dolore adipisci laboriosam natus dolorem vel doloribus facilis! Nulla, laborum quae nihil facere perferendis, totam necessitatibus consequatur quidem veniam, voluptate eius reprehenderit ea? Expedita, impedit excepturi eveniet eum voluptatibus, dicta repellat qui officiis similique eligendi illum. Nostrum blanditiis sunt eaque vitae accusamus esse, laboriosam corrupti reiciendis dolorum nihil odit, rem harum nulla, asperiores reprehenderit itaque aliquam adipisci! Deleniti tenetur quaerat eaque ex sequi.`
				:`Test Task Description #${i}`, 
				`A Person #${i}`, 
				new Date(), 
				status
			);
		}
	})


	//Changes button from "marked as done" to "save task" on open card when change detected.
	document.getElementById("opencard-status").addEventListener("change", updateOpenCardButtons)

	//Swaps "mark as done" button with "Update task" button if required
	function updateOpenCardButtons() {
		const btnUpdate = document.getElementById("btn-opencard-update")
		const btnMark = document.getElementById("btn-opencard-mark")

		const newStatusValue = document.getElementById("opencard-status").value;

		//Get task id from HTML
		const taskID = Number(document.getElementById("open-card").getAttribute("task-id"))
		const taskObj = tm.getTaskByID(taskID);


		const oldStatus = taskObj.Status;

		if (newStatusValue === oldStatus) {
			//Show mark button and hide update
			btnMark.classList = "btn btn-primary"
			btnUpdate.classList = "btn btn-primary none"
		} else {
			//Show update button and hide mark
			btnUpdate.classList = "btn btn-primary"
			btnMark.classList = "btn btn-primary none"
		}

		if (taskObj.Status === Object.keys(TaskManager.taskStatus())[3]) {
			document.getElementById("btn-opencard-mark").setAttribute("disabled", '')
		} else {
			document.getElementById("btn-opencard-mark").removeAttribute("disabled", '')
		}
	}

	//Updates data on card popup: Cameron
	document.getElementById("content-container").addEventListener("click", (e) => {
		e.stopPropagation() //Stops the event from "bubbling" past this container
		let element = e.target
		
		//Returns if event was fired on the container
		if (element == null || element === e.currentTarget)
			return

		//Navigates up the DOM to find the "li" element which contains the taskID
		while (element.nodeName !== "LI") {
			
			element = element.parentElement
			if(element.nodeName == null || element.parentElement == null)
				return
		}

		//Extracts task ID
		const taskID = Number(element.getAttribute("task-id"))

		//Validate taskID
		if (isNaN(taskID) || !(taskID > 0))
			throw new Error(`TaskID on li element is malformed: taskID = ${taskID}`)

		//Get task by ID, converts taskID to number (because it's a typeof string)
		const myTask = tm.getTaskByID(taskID);

		//Validate task (checks if task was returned, I know it doesn't have to check the ID, but I wanted to and it doesn the same thing)
		if (!myTask || myTask.ID !== taskID)
			throw new Error("Task does not exist?!")

		//Render card data
		tm.renderOpenCard(myTask)

		//Swaps and disabled buttons if needed
		updateOpenCardButtons()
	})

	//Form submit event for add new task
	document.getElementById("frm-new-task").addEventListener('submit', (e) => {
		e.preventDefault(); //Prevents the form from sending us to a new page
		clearValidation(); //Removes any error messages already being displayed
		let wasError = false; //Boolean used to detect if there was an error (allows for all form inputs to be validated at once)

		//? Name Validation: James
		//Checks if input is empty or less than 9 characters
		const nameField = document.getElementById("txt-new-task-name")
		if (nameField.value == '' || nameField.value.length <= 8) {
			validationFailed(nameField, "Needs to be longer than 8 characters!")
			wasError = true;
			//Validate in html
		}

		//? Description Validation: Declan
		const taskDescription = document.querySelector('#txt-new-task-description')

		//Checks if input is empty or less than 16 characters
		if (taskDescription.value == '' || taskDescription.value.length <= 15) {
			validationFailed(taskDescription, "Needs to be longer than 15 characters!")
			wasError = true;
		}


		//? Assign To Validation: Cameron
		const assignedElement = document.getElementById("txt-new-task-assigned-to")

		//Check if input is empty or less than 9 characters
		if (assignedElement.value == '' || assignedElement.value.length <= 8) {
			validationFailed(assignedElement, "Needs to be longer than 8 characters!")
			wasError = true;
		}

		//? Status validation: Cameron
		const statusElement = document.getElementById("txt-new-task-status")

		//Checks value against the taskStatus "enum"
		if (!TaskManager.taskStatus()[statusElement.value]) {
			validationFailed(statusElement, "Please select a valid status!");
			wasError = true;
		}

		//? Due Date Validation: Cameron
		//Date object saved seperately in case of error
		const dsDueDateElement = document.getElementById("ds-task-due-date")

		//Get dates to compare
		const date = dsDueDateElement.valueAsDate
		let currentDate = new Date()

		//Removes time from both so comparison works properly (bug fix)
		if(date != null){
			date.setHours(0,0,0,0)
			currentDate.setHours(0,0,0,0)
		}

		//If date is "less than current date" throw error
		if (date === null) {
			validationFailed(dsDueDateElement, "Due Date cannot be set in the past!")
			wasError = true;
		} else if (date < currentDate) {
			validationFailed(dsDueDateElement, "Due Date cannot be set in the past!")
			wasError = true;
		}

		//If there was an error, return.
		if (wasError) return

		//Saves task
		tm.addTask(
			nameField.value,
			taskDescription.value,
			assignedElement.value,
			date,
			statusElement.value
		);

		//Closes modal by firing click event on the close button (Also clears form)
		//According to sofia, there is a data attribute for bootstrap that lets you programatically dismiss a modal, I'll look into it later
		document.getElementById("btn-new-task-cancel").click()
	});

	document.getElementById("btn-new-task-cancel").addEventListener("click", (e) => {
		clearNewTaskForm()
	})

	document.getElementById("btn-new-task-reset").addEventListener("click", (e) => {
		clearNewTaskForm()
	})

	//Marks a form input to be invalid
	function validationFailed(inputElement, message) {
		const messageTarget = inputElement.parentElement.getElementsByTagName("span")[0];
		messageTarget.innerHTML = `${message}`
		messageTarget.classList = "inputError"
	}

	//Clears the input error messages from screen
	function clearValidation() {
		//Get all input error spans
		const errorTarget = document.querySelectorAll(".inputError")

		//If there is more than 0 error messages showing, loop through each one and set class to none (display none)
		if (errorTarget.length > 0) {
			errorTarget.forEach(target => {
				target.classList = "none"
			});
		}
	}

	function clearNewTaskForm() {
		clearValidation()
		document.getElementById("txt-new-task-name").value = ''
		document.querySelector('#txt-new-task-description').value = ''
		document.getElementById("txt-new-task-assigned-to").value = ''
		document.getElementById("txt-new-task-status").value = Object.keys(TaskManager.taskStatus())[0]
		document.getElementById("ds-task-due-date").value = null
	}

	//updates the time
	function updateTime() {
		const date = new Date();
		const timeElement = document.getElementById("current-date-container");

		//Set date and time
		timeElement.innerHTML = `${formatTime()}<br>${
			//Prepends a 0 if the day is less than 10.
			(date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()
			}/${
			//Prepends a 0 if month is less than 10
			((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : date.getMonth() + 1
			}/${date.getFullYear()}`
		updateDueDateLimit()
	}

	//Changes the min limlit on the DueDate input
	async function updateDueDateLimit() {
		const today = new Date();
		document.getElementById("ds-task-due-date").setAttribute("min",
			`${
				today.getFullYear()
			}-${
				(today.getMonth() + 1 < 10) ? `0${today.getMonth() + 1}`:today.getMonth() + 1
			}-${
				(today.getDate() < 10) ? `0${today.getDate()}`:today.getDate()
		}`)
	}

	//A fucntion that formats 24 hour time into 12 hour time
	function formatTime(seconds = false, date = new Date()) {
		return `${
			//Convert 24 hour to 12 hour
			(date.getHours() > 12) ? date.getHours() - 12 : date.getHours()
			}:${
			//Prepend a 0 if minutes is less than 10
			(date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes()
			}${
			//If seconds is desired, get seconds and prepend a 0 if less than 10, otherwise return seconds
			(seconds) ? `${(date.getSeconds() < 10) ? `:0${date.getSeconds()}` : `:${date.getSeconds()}`}` : ''
			}${
			//If (in 24 hours) 12 or past 12, set to pm, otherwise am
			(date.getHours() >= 12) ? 'pm' : 'am'
			}`;
	}

	setInterval(updateTime, 1000) //If showing seconds, change this to be lower (like 5ms)
});

