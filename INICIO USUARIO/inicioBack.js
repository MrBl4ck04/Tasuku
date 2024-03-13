document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('addTask').addEventListener('click', openAddTaskModal);
    document.getElementById('addTaskForm').addEventListener('submit', addTask);
    document.querySelector('.close').addEventListener('click', closeAddTaskModal);
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        // Columna del nombre de la tarea
        const taskName = document.createElement('div');
        taskName.textContent = task.name;
        taskName.className = 'task-name';
        taskItem.appendChild(taskName);

        // Columna del ícono de la categoría
        const taskCategoryIcon = document.createElement('div');
        const iconImg = document.createElement('img');
        iconImg.src = task.icon; // La URL del ícono deberá estar en el objeto de la tarea
        iconImg.className = 'task-icon';
        taskCategoryIcon.appendChild(iconImg);
        taskItem.appendChild(taskCategoryIcon);

        // Columna del estado de la tarea
        const taskStatus = document.createElement('div');
        taskStatus.className = 'task-status';
        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'status-indicator';
        statusIndicator.style.backgroundColor = task.statusColor; // El color se basa en el estado de la tarea
        taskStatus.appendChild(statusIndicator);
        taskItem.appendChild(taskStatus);

        // Doble clic para editar la tarea
        taskItem.addEventListener('dblclick', () => {
            const newName = prompt('Edita tu tarea:', task.name);
            if (newName !== null && newName !== task.name) {
                task.name = newName;
                saveTasks(tasks);
            }
        });

        // Clic derecho para eliminar la tarea
        taskItem.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (confirm('¿Quieres eliminar esta tarea?')) {
                tasks.splice(index, 1);
                saveTasks(tasks);
            }
        });

        taskList.appendChild(taskItem);
    });
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function openAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'block';
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'none';
}

function addTask(event) {
    event.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const taskCategory = document.getElementById('taskCategory').value;
    const taskStatus = document.getElementById('taskStatus').value;
    const taskDate = document.getElementById('taskDate').value;

    const task = {
        name: taskName,
        category: taskCategory,
        status: taskStatus,
        date: taskDate,
        icon: 'icon-url.png', // Deberías tener una manera de seleccionar un ícono
        statusColor: getStatusColor(taskStatus) // Deberías tener una función que determine el color basado en el estado
    };

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    saveTasks(tasks);
    closeAddTaskModal();
}

function getStatusColor(status) {
    const statusColors = {
        'Pendiente': 'red',
        'En Progreso': 'yellow',
        'Completada': 'green'
    };
    return statusColors[status] || 'grey';
}

document.getElementById('addTask').addEventListener('click', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    saveTasks(tasks);
    
});