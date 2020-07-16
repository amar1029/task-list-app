//Note: this is far from working 100% yet
const errorExistingUser = document.getElementById('error-existing-user');
errorExistingUser.style.display = 'none'
const errorNewUser = document.getElementById('error-new-user');
errorNewUser.style.display = 'none';

document.getElementById('loggedIn').style.display = "none"
document.getElementById('logInPage').style.display = "block"

class Task {
    constructor(id, title, priorityId, uid) {
        this.id = id;
        this.title = title;
        this.priorityId = priorityId; //Low, Medium, or High 
        this.uid = uid
        this.priority = {
            "Low": {
                "color": "green",
                "message": "Finish this week"
            },
            "Medium": {
                "color": "orange",
                "message": "Finish in 3 days"
            },
            "High": {
                "color": "red",
                "message": "Finish today"
            }
        }
    }
}
class TaskListPage {
    constructor() {
        this.tasks = [];
        this.priorities = [];

        firebase.database().ref('tasks').once('value', (snapshot) => {
            const allTasks = snapshot.val();

            Object.keys(allTasks).forEach((taskId) => {
                const taskData = allTasks[taskId];
                const task = new Task(taskData.id, taskData.task, taskData.priorityId);
                this.tasks.push(task);
            
                const taskListElement = document.getElementById('taskList');
                const row = document.createElement('tr');
                row.setAttribute('data-task-id', task.id);
                row.innerHTML = `
                <td>${task.title}</td>
                <td class="text-center"><button data-action="edit" data-task-id="${task.id}" class="btn btn-warning">Edit</button></td>
                <td class="text-center"><button data-action="delete" data-task-id="${task.id}" class="btn btn-danger">Delete</button></td>
                <td class="text-center">${task.priorityId}</td>
                `
                taskListElement.appendChild(row);
            })
        });
}

    addTask(title, priorityId) {
        const taskId = firebase.database().ref().child('tasks').push().key;

        const selectPriorityMenu = document.getElementById('selectPriority');
        var priorityId = selectPriorityMenu.options[selectPriorityMenu.selectedIndex].value;

        const task = new Task(taskId, title, priorityId);
 
        this.tasks.push(task);
        this.priorities.push(priorityId);

        firebase.database().ref("tasks/" + taskId).set({
            id: task.id,
            task: task.title, 
            priorityId: task.priorityId
        });

        firebase.database().ref("priorities/" + taskId).set({
            priorityId: task.priorityId
        })

        const taskListElement = document.getElementById("taskList");
        const row = document.createElement("tr");
        row.setAttribute("data-task-id", task.id);
        row.innerHTML = `
      <td class="text-center">${task.title}</td>
      <td class="text-center"><button data-action="edit" data-task-id="${task.id}" class="btn btn-warning">Edit</button></td>
      <td class="text-center"><button data-action="delete" data-task-id="${task.id}" class="btn btn-danger">Delete</button></td>
      <td class="text-center">${priorityId}</td>
      `;

        taskListElement.appendChild(row);
        document.getElementById("task").value = "";
        resetSelectElement(selectPriorityMenu)

        function resetSelectElement(selectPriorityMenu) {
            selectPriorityMenu.selectedIndex = 0; 
        }
    }

    startEditingTask(taskId, priorityId) {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id == taskId) {
                const task = this.tasks[i];
                const taskInputElement = document.getElementById("task");
                taskInputElement.value = task.title;

                const selectPriorityMenu = document.getElementById('selectPriority');
                priorityId = this.tasks[i].priorityId
                console.log(priorityId)
                selectPriorityMenu.value = priorityId
                
                taskInputElement.setAttribute("data-task-id", task.id);
                document.getElementById("addBtn").innerText = "Save";
            }
        }
    }
    saveTaskTitle(taskId, taskTitle, priorityId) {
        const task = this.tasks.find((task) => task.id == taskId);
        if (!task) return;
        task.title = taskTitle;
        task.priorityId = priorityId

        const existingRow = document.querySelector(`tr[data-task-id="${task.id}"]`);
        if (!existingRow) return;
        existingRow.children[0].innerHTML = task.title;
        existingRow.children[3].innerHTML = task.priorityId;

        const taskInput = document.getElementById("task");
        taskInput.removeAttribute("data-task-id");
        taskInput.value = "";
        const selectPriorityMenu = document.getElementById('selectPriority')
        resetSelectElement(selectPriorityMenu)

        function resetSelectElement(selectPriorityMenu) {
            selectPriorityMenu.selectedIndex = 0; 
        }

        document.getElementById("addBtn").innerText = "Add";

        firebase.database().ref(`/tasks/${task.id}/`).set({
            id: task.id,
            task: task.title,
            priorityId: task.priorityId
        })

        firebase.database().ref(`/priorities/${task.id}`).set({
            priorityId: task.priorityId
        })
    }

    deleteTask(taskId) {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id == taskId) {
                const task = this.tasks[i];
                const deleteRow = document.querySelector(`tr[data-task-id="${task.id}"]`)
                deleteRow.remove();

                firebase.database().ref('tasks/' + taskId).remove();
                firebase.database().ref('priorities/' + taskId).remove();
            }
        }
    }
}
const taskListPage = new TaskListPage();

document.getElementById("addBtn").addEventListener("click", (e) => {
    const taskInputElement = document.getElementById("task");
    const taskTitle = taskInputElement.value;
    const existingTaskId = taskInputElement.getAttribute("data-task-id");
    const priority = document.getElementById('selectPriority');
    var selectedPriority = priority.options[priority.selectedIndex].value;
    if (existingTaskId) {
        taskListPage.saveTaskTitle(existingTaskId, taskTitle, selectedPriority);
    } else {
        taskListPage.addTask(taskTitle, selectedPriority);
    }
});

document.getElementById("taskList").addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    const taskId = e.target.getAttribute("data-task-id");
    const priority = document.getElementById('selectPriority');
    var selectedPriority = priority.options[priority.selectedIndex].value;
    if (action == "edit") {
        taskListPage.startEditingTask(taskId, selectedPriority);
    } else if (action == "delete") {
        taskListPage.deleteTask(taskId);
    }
});




