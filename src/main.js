console.log("Script loaded");
window.addEventListener('DOMContentLoaded', () => {
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


		//? Description Validation (easy): Declan
		/* Not Empty and longer than 15 characters */


		//? Assign To Validation (easy): Tamika
		/* Not Empty and longer than 8 characters */


		//? Due Date Validation (hard): Cameron
		/* Not Empty and not less than current date */


	});
});