document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        // Aquí podrías agregar un botón de eliminar o de editar junto a cada tarea
        taskList.appendChild(li);
    });
}

document.getElementById('addTask').addEventListener('click', () => {
    const taskName = prompt('Nombre de la nueva tarea:');
    if (taskName) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ name: taskName });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
});

document.getElementById('addCategory').addEventListener('click', () => {
    const categoryName = prompt('Nombre de la nueva categoría:');
    if (categoryName) {
        const categoriesList = document.querySelector('#categories ul');
        const li = document.createElement('li');
        li.textContent = categoryName;
        categoriesList.appendChild(li);
        // Considera guardar las categorías en localStorage aquí
    }
});