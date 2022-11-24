
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
	/* returns a list (array) of all tasks where a status is equal to the status passes as an argument */

	/* addTask(name, etc) (Medium): Cameron */
	/* Add a task to existing taks list (array)*/
	/* task argument is a product of taskObjFactory */
	/* TASK 7: call render() method */
	addTask(name, description, assignedTo, dueDate, status){
		const id = this.#taskList.length;
		this.#taskList.push(taskObjFactory(id, name, description, assignedTo, dueDate, status));
		//Call render()
	}


	/* TASK 7 */
	/* render() */
	/* Render both calls the createTaskHTML and displays to DOM */
	/* Loop through aray and call createTaskHTML for each object and pass object, the add child to card container */
	/* ul ID: content-container */

	/* createTaskHTML */
	/* Takes an JSON object as an argument and spits out a card html with data */
}