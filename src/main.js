console.log("Script loaded");

window.addEventListener('DOMContentLoaded', () => {
	updateTime() //Technically I'm making a date object as soon as the page loads.
	const tm = new TaskManager()
	
	//Updates data on card popup: Cameron
	document.getElementById("content-container").addEventListener("click", (e) => {
		e.stopPropagation() //Stops the event from "bubbling" past this container
		let element = e.target

		//Returns if event was fired on the container
		if(element === e.currentTarget)
			return
		
		//Navigates up the DOM to find the "li" element which contains the taskID
		while(element.nodeName !== "LI"){
			element = element.parentElement
		}

		//Extracts task ID
		const taskID = Number(element.id[element.id.length - 1])

		//Validate taskID
		if(!(taskID > 0))
			throw new Error(`TaskID on li element is malformed: taskID = ${taskID}`)
		

		//Get task by ID
		const myTask = tm.getTaskByID(taskID);
		
		//Validate task (checks if task was returned, I know it doesn't have to check the ID, but I wanted to and it doesn the same thing)
		if(!myTask || myTask.ID !== taskID)
			throw new Error("Task does not exist?!")
		
		tm.renderCard(myTask)



		/* div class="modal fade" id="open-card" tabindex="-1" role="form" aria-labelledby="open-card-title"
		aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="open-card-title">Task Name</h5>
					<p id="open-card-duedate-assignedto">Tamika - 11/12</p>
				</div>

				<div class="modal-body">
					<p id="open-card-description">Loading</p>
				</div>

				<div class="modal-footer" id="opencard-footer">
					<div id="card-control-container">
						<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>

						<label for="opencard-status">Status</label>
						<select class="form-select" name="opencard-status" id="opencard-status">
							<option value="todo" id="open-card-todo">To Do</option>
							<option value="inprogress" id="open-card-inprogress">In Progress</option>
							<option value="review" id="open-card-review">Review</option>
							<option value="complete" id="open-card-complete">Complete</option>
						</select>
					</div>

					<div id="opencard-save-close-container">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button id="btn-opencard-submit" class="btn btn-primary">Save</button>
					</div>
				</div> */
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
		const taskDescription = document.querySelector('#txt-new-task-description');

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
			
		//Saves task
		tm.addTask(
			nameField.value,
			taskDescription.value,
			assignedElement.value,
			date,
			statusElement.value
		);
		
		//Closes modal by firing click event on the close button
		document.getElementById("btn-new-task-cancel").click()
	});

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