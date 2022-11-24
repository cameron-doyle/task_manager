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
		clearValidation();
		let wasError = false;

		//? Name Validation (easy): James
		/* Not Empty and longer than 8 characters */
		const nameField = document.getElementById("txt-new-task-name")
		if (nameField.value === '' || nameField.value.length <= 8) {
			validationFailed(nameField, "Needs to be longer than 8 characters!")
			wasError = true;
			//Validate in html
		}

		//? Description Validation (easy): Declan
		/* Not Empty and longer than 15 characters */
		const taskDescription = document.querySelector('#txt-new-task-description');
		let taskDescriptionValue = taskDescription.value;

		if (taskDescriptionValue.length <= 15) {
			validationFailed(taskDescription, "Needs to be longer than 15 characters!")
			wasError = true;
		}


		//? Assign To Validation (easy): Cameron (Tamika was absent)
		/* Not Empty and longer than 8 characters */
		const assignedElement = document.getElementById("txt-new-task-assigned-to")
		if(assignedElement.value === '' || assignedElement.value.length <= 8){
			validationFailed(assignedElement, "Needs to be longer than 8 characters!")
			wasError = true;
		}

		/* Validate Status */
		const statusElement = document.getElementById("txt-new-task-status")
		
		//It get's the job done
		switch (statusElement.value) {
			case "todo":
				//Valid value
				break;
			case "inprogress":
				//Valid value
				break;
			case "review":
				//Valid value
				break;
			case "complete":
				//Valid value
				break;
		
			default:
				validationFailed(statusElement, "Please select a valid status!");
				wasError = true;
				break;
		}


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
			wasError = true;
		}

		//If there was an error, return.
		if(wasError) return
			

		ts.addTask(
			nameField.value,
			taskDescription.value,
			assignedElement.value,
			date,
			statusElement.value
		);
		
		//Closes modal by firing click event on the close button
		document.getElementById("btn-new-task-cancel").click()
	});

	//Marks a form to be invalid
	function validationFailed(inputElement, message) {
		const messageTarget = inputElement.parentElement.getElementsByTagName("span")[0];
		messageTarget.innerHTML = `${message}`
		messageTarget.classList = "inputError"
	}

	function clearValidation(){
		const errorTarget = document.querySelectorAll(".inputError")
		if(errorTarget.length > 0){
			errorTarget.forEach(target => {
				target.classList = "none"
			});
		}
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