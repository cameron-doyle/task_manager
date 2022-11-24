
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
		};
	}


	
	constructor(){
		//Do stuff in future
	}


	/* getAllTasks(): (easy): James */
	/* returns a list (array) of all tasks */

	/* getTasksWithStatus(status) (Hard): Declan */
	getTasksWithStatus (status) {
		let newTaskList = [];
		this.taskList.forEach(task => {
			if(task.Status === status)
			newTaskList.push(task)
			
		});
	return newTaskList
	}
	/* returns a list (array) of all tasks where a status is equal to the status passes as an argument */

	/* addTask(task) (Medium): Cameron */
	/* Add a task to existing taks list (array)*/
	/* task argument is a product of taskObjFactory */
	/* TASK 7: call render() method */


	/* TASK 7 */
	/* render() */
	/* Render both calls the createTaskHTML and displays to DOM */
	/* Loop through aray and call createTaskHTML for each object and pass object, the add child to card container */
	/* ul ID: content-container */

	/* createTaskHTML */
	/* Takes an JSON object as an argument and spits out a card html with data */
}