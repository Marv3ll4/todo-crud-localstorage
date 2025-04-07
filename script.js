document.addEventListener('DOMContentLoaded', () => {
    const taskNameInput = document.getElementById('taskName');
    const taskTypeInput = document.getElementById('taskType');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskColorInput = document.getElementById('taskColor');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearAllBtn = document.getElementById('clearAllBtn');

    const editModal = document.getElementById('editModal');
    const closeEditModalBtn = editModal.querySelector('.close-button');
    const editTaskNameInput = document.getElementById('editTaskName');
    const editTaskTypeInput = document.getElementById('editTaskType');
    const editTaskDescriptionInput = document.getElementById('editTaskDescription');
    const editTaskColorInput = document.getElementById('editTaskColor');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editTaskIdInput = document.getElementById('editTaskId');

    let tasks = loadTasks();

    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.style.backgroundColor = task.color;
            listItem.innerHTML = `
                <div class="task-details">
                    <h3>${task.name}</h3>
                    ${task.type ? `<p><strong>Type:</strong> ${task.type}</p>` : ''}
                    ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
                </div>
                <div class="task-actions">
                    <button class="edit-btn" data-id="${task.id}">Edit</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });

        // Attach event listeners to the newly created edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', editTask);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', deleteTask);
        });
    }

    function addTask() {
        const name = taskNameInput.value.trim();
        const type = taskTypeInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const color = taskColorInput.value;

        if (name) {
            const newTask = {
                id: Date.now(), // Simple unique ID
                name,
                type,
                description,
                color
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskNameInput.value = '';
            taskTypeInput.value = '';
            taskDescriptionInput.value = '';
            taskColorInput.value = '#f0f0f0';
        } else {
            alert('Task name is required.');
        }
    }

    function editTask(event) {
        const taskId = parseInt(event.target.dataset.id);
        const taskToEdit = tasks.find(task => task.id === taskId);

        if (taskToEdit) {
            editTaskIdInput.value = taskToEdit.id;
            editTaskNameInput.value = taskToEdit.name;
            editTaskTypeInput.value = taskToEdit.type || '';
            editTaskDescriptionInput.value = taskToEdit.description || '';
            editTaskColorInput.value = taskToEdit.color;
            editModal.style.display = 'block';
        }
    }

    function saveEditedTask() {
        const taskId = parseInt(editTaskIdInput.value);
        const updatedTask = {
            id: taskId,
            name: editTaskNameInput.value.trim(),
            type: editTaskTypeInput.value.trim(),
            description: editTaskDescriptionInput.value.trim(),
            color: editTaskColorInput.value
        };

        const index = tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
            saveTasks();
            renderTasks();
            editModal.style.display = 'none';
        }
    }

    function deleteTask(event) {
        const taskId = parseInt(event.target.dataset.id);
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    function clearAllTasks() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    }

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    clearAllBtn.addEventListener('click', clearAllTasks);
    saveEditBtn.addEventListener('click', saveEditedTask);
    closeEditModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Initial rendering of tasks
    renderTasks();
});