console.log("Script loaded");

window.addEventListener('DOMContentLoaded', () => {
	updateTime(); //Technically I'm making a date object as soon as the page loads.
	const ts = new TaskManager();
	/* TASK 4 - Validate form inputs */
	/*  - All form fields are validated on form submission(Name, Description, AssignedTo, DueDate, Status).
		- A meaningful error message is displayed when a form field is invalid.
		- The JavaScript code is in a separate file and the file is included in	the HTML page with no errors.

		Details are below:
		Implement a form that captures the fields required to create a task.

		Requirements:
		Create a JavaScript function called “validateTaskForm” that verifies
		that the inputs inserted by the user in the task form are correct:
		- Name -> Not Empty and longer than 8 characters
		- Description -> Not Empty and longer than 15 characters
		- AssignedTo -> Not Empty and longer than 8 characters
		- DueDate -> Not Empty and not less than current date */

	//Form submit event for add new task
	document.getElementById("frm-new-task").addEventListener('submit', (e) => {
		e.preventDefault(); //Prevents the form from sending us to a new page
		console.log("Form submitted")

		//? Name Validation (easy): James
		/* Not Empty and longer than 8 characters */
		const nameField = document.getElementById("txt-new-task-name")
		if (nameField.value === '' || nameField.value.length <= 8) {
			validationFailed(assignedElement, "Needs to be longer than 8 characters!")
			return
			//Validate in html
		}

		//? Description Validation (easy): Declan
		/* Not Empty and longer than 15 characters */
		const taskDescription = document.querySelector('#txt-new-task-description');
		let taskDescriptionValue = taskDescription.value;

		if (taskDescriptionValue.length <= 15) {
			validationFailed(assignedElement, "Needs to be longer than 15 characters!")
			return
		}


		//? Assign To Validation (easy): Cameron (Tamika was absent)
		/* Not Empty and longer than 8 characters */
		const assignedElement = document.getElementById("txt-new-task-assigned-to")
		if(assignedElement.value === '' || assignedElement.value.length <= 8){
			validationFailed(assignedElement, "Needs to be longer than 8 characters!")
			return
		}

		/* Validate Status */
		const statusElement = document.getElementById("txt-new-task-status")


		//? Due Date Validation (hard): Cameron
		/* Not Empty and not less than current date */

		//Date object saved seperately in case of error
		const dsDueDateElement = document.getElementById("ds-task-due-date");

		//Get dates to compare
		const date = dsDueDateElement.valueAsDate;
		let currentDate = new Date();

		//If date is "less than current date" throw error
		if (date < currentDate) {
			validationFailed(dsDueDateElement, "Due Date cannot be set in the past!")
			return
		}

		//TODO: Save form
		//TODO: Bug with due date
		ts.addTask(
			nameField.value,
			taskDescription.value,
			assignedElement.value,
			date,
			statusElement.value
		);
	});

	//Marks a form to be invalid
	function validationFailed(inputElement, message) {
		const messageTarget = inputElement.parentNode.getElementsByClassName("alert-danger")[0];
		messageTarget.innerHTML = `<p>${message}</p>`
	}

	//updates the time
	function updateTime() {
		const date = new Date();
		const timeElement = document.getElementById("current-time");
		const dateElement = document.getElementById("current-date");

		//set time
		timeElement.textContent = `${formatTime()}`;

		//Set date
		dateElement.textContent = `${
			//Prepends a 0 if the day is less than 10.
			(date.getDay() < 10) ? `0${date.getDay()}` : date.getDay()
			}/${
			//Prepends a 0 if month is less than 10
			(date.getMonth() < 10) ? `0${date.getMonth()}` : date.getMonth()
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