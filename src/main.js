console.log("Script loaded");

window.addEventListener('DOMContentLoaded', () => {
	updateTime() //Technically I'm making a date object as soon as the page loads.
	const tm = new TaskManager()
	
	
	//! NOTE: used getTaskByID (see event below)
	/* Add event listener to mark us done button ElementID "btn-opencard-mark" (Easy): James */
	/* set status to "complete" with in the taskObj via taskID (See line 22-24) */
	/* Update the button class list to have "disabled" class attached to it */

	/* add event listener to button ElementID "opencard-delete" event "click" (easy): Declan */
	/* The button gets the taskObj via taskID (See line 22-24) and calls the tm.deleteTask(taskObj) */
	document.getElementById("opencard-delete").addEventListener("click", (e) => {
		//Get task id from HTML
		const taskID = Number(document.getElementById("open-card").getAttribute("task-id"))
		const taskObj = tm.getTaskByID(taskID);
		tm.deleteTask(taskObj)
	})


	//Changes button from "marked as done" to "save task" on open card when change detected.
	document.getElementById("opencard-status").addEventListener("change", (e) => {
		const primaryBtn = document.getElementById("opencard-save-close-container").querySelector(".btn-primary");
		const newStatusValue = e.target.value;
		
		//Get task id from HTML
		const taskID = Number(document.getElementById("open-card").getAttribute("task-id"))
		const taskObj = tm.getTaskByID(taskID);
		

		const oldStatus = taskObj.Status;

		if(newStatusValue === oldStatus){
			primaryBtn.id = "btn-opencard-mark";
			primaryBtn.innerHTML = "Mark as done"
		}else{
			primaryBtn.id = "btn-opencard-save";
			primaryBtn.innerHTML = "Save Task"
		}

		//TODO: Update task here
	})

	//Updates data on card popup: Cameron
	document.getElementById("content-container").addEventListener("click", (e) => {
		e.stopPropagation() //Stops the event from "bubbling" past this container
		let element = e.target

		const primaryBtn = document.getElementById("opencard-save-close-container").querySelector(".btn-primary");
		primaryBtn.id = "btn-opencard-mark";
		primaryBtn.innerHTML = "Mark as done"

		//Returns if event was fired on the container
		if(element === e.currentTarget)
			return
		
		//Navigates up the DOM to find the "li" element which contains the taskID
		while(element.nodeName !== "LI"){
			element = element.parentElement
		}

		//Extracts task ID
		const taskID = Number(element.getAttribute("task-id"))

		//Validate taskID
		if(isNaN(taskID) || !(taskID > 0))
			throw new Error(`TaskID on li element is malformed: taskID = ${taskID}`)

		//Get task by ID, converts taskID to number (because it's a typeof string)
		const myTask = tm.getTaskByID(taskID);
		
		//Validate task (checks if task was returned, I know it doesn't have to check the ID, but I wanted to and it doesn the same thing)
		if(!myTask || myTask.ID !== taskID)
			throw new Error("Task does not exist?!")

		//Render card data
		tm.renderOpenCard(myTask)
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
		if(assignedElement.value == '' || assignedElement.value.length <= 8){
			validationFailed(assignedElement, "Needs to be longer than 8 characters!")
			wasError = true;
		}

		//? Status validation: Cameron
		const statusElement = document.getElementById("txt-new-task-status")
		
		//Checks value against the taskStatus "enum"
		if(!tm.taskStatus()[statusElement.value]){
			validationFailed(statusElement, "Please select a valid status!");
			wasError = true;
		}

		//? Due Date Validation: Cameron
		//Date object saved seperately in case of error
		const dsDueDateElement = document.getElementById("ds-task-due-date")

		//Get dates to compare
		const date = dsDueDateElement.valueAsDate
		let currentDate = new Date()

		//If date is "less than current date" throw error
		if(date === null){
			validationFailed(dsDueDateElement, "Due Date cannot be set in the past!")
			wasError = true;
		} else if (date < currentDate) {
			validationFailed(dsDueDateElement, "Due Date cannot be set in the past!")
			wasError = true;
		}

		//If there was an error, return.
		if(wasError) return
			
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
	function clearValidation(){
		//Get all input error spans
		const errorTarget = document.querySelectorAll(".inputError")

		//If there is more than 0 error messages showing, loop through each one and set class to none (display none)
		if(errorTarget.length > 0){
			errorTarget.forEach(target => {
				target.classList = "none"
			});
		}
	}

	function clearNewTaskForm(){
		clearValidation()
		document.getElementById("txt-new-task-name").value = ''
		document.querySelector('#txt-new-task-description').value = ''
		document.getElementById("txt-new-task-assigned-to").value = ''
		document.getElementById("txt-new-task-status").value = Object.keys(tm.taskStatus())[0]
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

