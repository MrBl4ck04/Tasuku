document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('addTask').addEventListener('click', openAddTaskModal);
    document.getElementById('addTaskForm').addEventListener('submit', addTask);
    document.querySelector('.close').addEventListener('click', closeAddTaskModal);
});

function loadTasks(category = null) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    const filteredTasks = category ? tasks.filter(task => task.category === category) : tasks;

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const taskName = document.createElement('div');
        taskName.textContent = task.name;
        taskName.className = 'task-name';
        taskItem.appendChild(taskName);

        const taskCategoryIcon = document.createElement('div');
        const iconImg = document.createElement('img');
        iconImg.src = task.icon;
        iconImg.className = 'task-icon';
        taskCategoryIcon.appendChild(iconImg);
        taskItem.appendChild(taskCategoryIcon);

        const taskStatus = document.createElement('div');
        taskStatus.className = 'task-status';
        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'status-indicator';
        statusIndicator.style.backgroundColor = task.statusColor;
        taskStatus.appendChild(statusIndicator);
        taskItem.appendChild(taskStatus);

        taskItem.addEventListener('dblclick', () => {
            const newName = prompt('Edita tu tarea:', task.name);
            if (newName !== null && newName !== task.name) {
                task.name = newName;
                saveTasks(tasks);
            }
        });

        taskItem.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (confirm('¿Quieres eliminar esta tarea?')) {
                tasks.splice(index, 1);
                saveTasks(tasks);
            }
        });

        taskList.appendChild(taskItem);
        markDateOnCalendar(task.date, task.statusColor);
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

    // Marcar la fecha en el calendario
    markDateOnCalendar(taskDate, task.statusColor);
}

function markDateOnCalendar(date, statusColor) {
    // Formatear el mes para que coincida con el índice del array
    const [year, month, day] = date.split('-').map(Number);
    const formattedDate = `${year}-${month}-${day}`;

    // Guardar la información de la fecha marcada en el almacenamiento local
    const markedDates = JSON.parse(localStorage.getItem('markedDates')) || {};
    markedDates[formattedDate] = statusColor;
    localStorage.setItem('markedDates', JSON.stringify(markedDates));

    // Asegurar que el calendario se actualice correctamente si la fecha marcada pertenece al mes y año actualmente visibles
    if (currentYear === year && monthNumber === (month - 1)) {
        writeMonth(monthNumber);
    }
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

document.querySelectorAll('#categories ul li').forEach(item => {
    item.addEventListener('click', (event) => {
        const category = event.target.getAttribute('data-category');
        loadTasks(category);
    });
});

/*INICIO DE MES */
let monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diembre'];

let currentDate = new Date();
let currentDay = currentDate.getDate();
let monthNumber = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let dates = document.getElementById('dates');
let month = document.getElementById('month');
let year = document.getElementById('year');

let prevMonthDOM = document.getElementById('prev-month');
let nextMonthDOM = document.getElementById('next-month');

month.textContent = monthNames[monthNumber];
year.textContent = currentYear.toString();

prevMonthDOM.addEventListener('click', ()=>lastMonth());
nextMonthDOM.addEventListener('click', ()=>nextMonth());

writeMonth(monthNumber);

function writeMonth(month){
    dates.innerHTML ='';
    // Recuperar las fechas marcadas del almacenamiento local
    const markedDates = JSON.parse(localStorage.getItem('markedDates')) || {};

    for (let i = startDay(); i > 0 ; i--){
        dates.innerHTML += ` <div class="calendar__date calendar__item calendar__last-days">${getTotalDays(monthNumber - 1) - (i - 1)}</div> `;
    }

    for (let i = 1 ; i <= getTotalDays(month); i++ ){

        if ( i ===  currentDay){
            dates.innerHTML += ` <div class="calendar__date calendar__item calendar__today">${i}</div> `;
        }else{
            // Verificar si la fecha está marcada y pertenece al mes actual
            const currentDate = new Date(currentYear, month, i);
            const formattedDate = `${currentYear}-${month + 1}-${i}`;
            const markedDateColor = markedDates[formattedDate];

            if (markedDateColor && currentDate.getMonth() === month) {
                const dateStyle = `style="background-color: ${markedDateColor}"`;
                dates.innerHTML += ` <div class="calendar__date calendar__item" ${dateStyle}>${i}</div> `;
            } else {
                dates.innerHTML += ` <div class="calendar__date calendar__item">${i}</div> `;
            }
        }
    }
}



function getTotalDays(month){
    if (month === -1) month = 11;

    if  ( month == 0 || month == 2 || month == 4 || month == 7 || month == 9 || month == 11){
        return 31;
    }else if (month == 3 || month == 5 || month == 8 || month == 10 || month == 12){
        return 30;
    }else{
        return isLeap() ? 29:28;
    }
}

function isLeap(){
    return((currentYear % 100 !== 0) && (currentYear % 4 === 0) || (currentYear % 400 === 0))
}

function startDay(){
    let start = new Date(currentYear, monthNumber, 1);
    return((start.getDay() - 1) === -1) ?  6 : start.getDay() - 1;
}

function lastMonth(){
    if (monthNumber !== 0){
        monthNumber--;
    }else{
        monthNumber = 11;
        currentYear--;
    }

    setNewDate();
}

function nextMonth(){
    if (monthNumber !== 11){
        monthNumber++;
    }else{
        monthNumber = 0;
        currentYear++;
    }

    setNewDate();
}

function setNewDate(){
    currentDate.setFullYear(currentYear, monthNumber, currentDate);
    month.textContent = monthNames[monthNumber];
    year.textContent = currentYear.toString();

    dates.textContent = '';
    writeMonth(monthNumber);
}