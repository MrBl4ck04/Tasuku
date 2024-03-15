document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadCategories();
    updateTaskCategoryOptions();
    document.getElementById('addTask').addEventListener('click', openAddTaskModal);
    document.getElementById('addTaskForm').addEventListener('submit', addTask);
    document.querySelectorAll('.modal .close').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
            clearModalData(this.closest('.modal').id);
        });
    });
    document.getElementById('addCategory').addEventListener('click', openAddCategoryModal);
    document.getElementById('addCategoryForm').addEventListener('submit', addCategory);
    const emojiPicker = document.getElementById('emojiPicker');
    const emojiButton = document.getElementById('emojiButton');
    const selectedEmoji = document.getElementById('selectedEmoji');

    emojiButton.addEventListener('click', (event) => {
        const rect = emojiButton.getBoundingClientRect();
        emojiPicker.style.display = 'block';
        emojiPicker.style.left = `${rect.left + window.scrollX}px`;
        emojiPicker.style.top = `${rect.bottom + window.scrollY}px`;
    });

    emojiPicker.addEventListener('emoji-click', event => {
        selectedEmoji.textContent = event.detail.emoji.unicode;
        emojiPicker.style.display = 'none';
        emojiButton.dataset.selectedEmoji = event.detail.emoji.unicode;
    });

    document.querySelectorAll('.modal .close').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            closeButton.closest('.modal').style.display = 'none';
        });
    });

    function openAddCategoryModal() {
        document.getElementById('addCategoryModal').style.display = 'block';
    }
    
    function closeAddCategoryModal() {
        document.getElementById('addCategoryModal').style.display = 'none';
        clearModalData('addCategoryModal');
    }
    
    function addCategory(event) {
        event.preventDefault();
        const categoryName = document.getElementById('categoryName').value;
        const categoryColor = document.getElementById('categoryColor').value;
        const categoryEmoji = emojiButton.dataset.selectedEmoji;
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.push({ name: categoryName, emoji: categoryEmoji, color: categoryColor });
        localStorage.setItem('categories', JSON.stringify(categories));
        closeAddCategoryModal();
        loadCategories();
        updateTaskCategoryOptions();
    }

    function loadCategories() {
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        const categoriesList = document.querySelector('#categories ul');
        categoriesList.innerHTML = '';
        categories.forEach(category => {
            const categoryItem = document.createElement('li');
            categoryItem.setAttribute('data-category', category.name);
            categoryItem.innerHTML = `${category.emoji} ${category.name}`;
            categoryItem.style.color = category.color;
            categoriesList.appendChild(categoryItem);

            categoryItem.addEventListener('dblclick', () => openEditCategoryModal(category));
            categoryItem.addEventListener('click', () => loadTasks(category.name));
        });
    }

    function openEditCategoryModal(category) {
        document.getElementById('editCategoryModal').style.display = 'block';
        document.getElementById('editCategoryName').value = category.name;
        document.getElementById('editCategoryColor').value = category.color;
        document.getElementById('editEmojiButton').dataset.selectedEmoji = category.emoji;
        document.getElementById('editSelectedEmoji').textContent = category.emoji;
        document.getElementById('editCategoryForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const newName = document.getElementById('editCategoryName').value;
            const newColor = document.getElementById('editCategoryColor').value;
            const newEmoji = document.getElementById('editEmojiButton').dataset.selectedEmoji;
            editCategory(category.name, newName, newColor, newEmoji);
        });
    }

    function editCategory(oldName, newName, newColor, newEmoji) {
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        const updatedCategories = categories.map(category => {
            if (category.name === oldName) {
                return { name: newName, emoji: newEmoji, color: newColor };
            }
            return category;
        });
        localStorage.setItem('categories', JSON.stringify(updatedCategories));

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.map(task => {
            if (task.category === oldName) {
                task.category = newName;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
        loadCategories();
        updateTaskCategoryOptions();
        document.getElementById('editCategoryModal').style.display = 'none';
    }
    

    function updateTaskCategoryOptions() {
        const taskCategorySelect = document.getElementById('taskCategory');
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        taskCategorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = `${category.emoji} ${category.name}`;
            taskCategorySelect.appendChild(option);
        });
    }
    
    // Llamada a loadCategories para cargar las categorías al iniciar la app
    loadCategories();
    function loadTasks(category = null) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    const filteredTasks = category ? tasks.filter(task => task.category === category) : tasks;

    filteredTasks.forEach((task) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const taskName = document.createElement('div');
        taskName.textContent = `${task.icon} ${task.name}`; // Mostrar el emoji junto al nombre
        taskName.className = 'task-name';
        taskItem.appendChild(taskName);

        const taskStatus = document.createElement('div');
        taskStatus.className = 'task-status';
        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'status-indicator';
        statusIndicator.style.backgroundColor = task.statusColor;
        taskStatus.appendChild(statusIndicator);
        taskItem.appendChild(taskStatus);

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
        clearModalData('addTaskModal');
    }

    function addTask(event) {
        event.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const taskCategory = document.getElementById('taskCategory').value;
        const taskStatus = document.getElementById('taskStatus').value;
        const taskDate = document.getElementById('taskDate').value;

        // Buscar el emoji de la categoría seleccionada
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        const category = categories.find(cat => cat.name === taskCategory);
        const categoryEmoji = category ? category.emoji : '';

        const task = {
            name: taskName,
            category: taskCategory,
            status: taskStatus,
            date: taskDate,
            icon: categoryEmoji, // Usar el emoji de la categoría en lugar de una URL de ícono estándar
            statusColor: getStatusColor(taskStatus)
        };

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        saveTasks(tasks);
        closeAddTaskModal();
        loadTasks(); // Recargar tareas para mostrar la nueva

        // Marcar la fecha en el calendario
        markDateOnCalendar(taskDate, task.statusColor);
    }

    function markDateOnCalendar(date, statusColor) {
        const calendarDates = document.querySelectorAll('.calendar__date');
        const [year, month, day] = date.split('-').map(Number);

        // Formatear el mes para que coincida con el índice del array
        const monthIndex = month - 1;

        // Iterar sobre los elementos de fecha en el calendario
        calendarDates.forEach(calendarDate => {
            const dateText = calendarDate.textContent.trim();
            if (dateText !== '') {
                const calendarDay = parseInt(dateText, 10);
                if (calendarDay === day) {
                    // Comparar el año y el mes para asegurarse de que coincidan
                    if (currentYear === year && monthNumber === monthIndex) {
                        calendarDate.style.backgroundColor = statusColor;
                        calendarDate.style.color = 'white'; // Asegurar que el texto sea legible

                        // Guardar la información de la fecha marcada en el almacenamiento local
                        const markedDates = JSON.parse(localStorage.getItem('markedDates')) || {};
                        if (!markedDates[`${year}-${month}-${day}`]) {
                            markedDates[`${year}-${month}-${day}`] = statusColor;
                            localStorage.setItem('markedDates', JSON.stringify(markedDates));
                        }
                    }
                }
            }
        });
    }


    function getStatusColor(status) {
        const statusColors = {
            'Pendiente': 'red',
            'En Progreso': 'yellow',
            'Completada': 'green'
        };
        return statusColors[status] || 'grey';
    }

    function clearModalData(modalId) {
        if (modalId === 'addTaskModal') {
            document.getElementById('taskName').value = '';
            document.getElementById('taskCategory').selectedIndex = 0;
            document.getElementById('taskStatus').selectedIndex = 0;
            document.getElementById('taskDate').value = '';
        } else if (modalId === 'addCategoryModal') {
            document.getElementById('categoryName').value = '';
            document.getElementById('categoryColor').value = '#ffffff';
            selectedEmoji.textContent = '';
            emojiButton.dataset.selectedEmoji = '';
        }
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
/* Modificado para que caundo se elimine una tarea tambien se elimine su marca */
    document.getElementById('taskList').addEventListener('contextmenu', event => {
        event.preventDefault();
        const taskDiv = event.target.closest('.task-item');
        if (taskDiv) {
            const taskName = taskDiv.querySelector('.task-name').textContent;
            const confirmDelete = confirm(`¿Eliminar la tarea '${taskName}'?`);
            if (confirmDelete) {
                // Eliminar tarea
                const tasks = JSON.parse(localStorage.getItem('tasks'));
                const taskToDelete = tasks.find(task => `${task.icon} ${task.name}` === taskName);
                const updatedTasks = tasks.filter(task => `${task.icon} ${task.name}` !== taskName);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                
                // Aquí comprobamos si necesitamos desmarcar la fecha en el calendario
                const tasksOnSameDate = updatedTasks.filter(task => task.date === taskToDelete.date);
                if (tasksOnSameDate.length === 0) {
                    // Si no hay más tareas en esta fecha, actualizamos el calendario
                    unmarkDateOnCalendar(taskToDelete.date);
                }
                
                loadTasks();
            }
        }
    });
    /*Funcion que desmarca la fecha en el calendario cuando se elmina la tarea */
    function unmarkDateOnCalendar(date) {
        // Convertir la fecha a formato año-mes-día para coincidir con las claves en markedDates
        const formattedDate = date.split("-").map(num => parseInt(num, 10)); // Convertir a números para quitar ceros iniciales
        const [year, month, day] = formattedDate;
    
        // Obtener las fechas marcadas del almacenamiento local
        const markedDates = JSON.parse(localStorage.getItem('markedDates')) || {};
    
        // Comprobar si la fecha está marcada
        if (markedDates[`${year}-${month}-${day}`]) {
            // Si está marcada y no hay más tareas para esta fecha, se elimina la marca
            delete markedDates[`${year}-${month}-${day}`];
            localStorage.setItem('markedDates', JSON.stringify(markedDates));
            
            // Refrescar el calendario para reflejar la eliminación de la marca
            dates.textContent = ''; // Limpiar las fechas actuales del calendario
            writeMonth(monthNumber); // Reescribir el mes actual para actualizar las marcas
        }
    }    

    document.getElementById('taskList').addEventListener('contextmenu', event => {
        event.preventDefault();
        const taskDiv = event.target.closest('.task-item');
        if (taskDiv) {
            const taskName = taskDiv.querySelector('.task-name').textContent;
            const confirmDelete = confirm(`¿Eliminar la tarea '${taskName}'?`);
            if (confirmDelete) {
                // Eliminar tarea
                const tasks = JSON.parse(localStorage.getItem('tasks'));
                const updatedTasks = tasks.filter(task => `${task.icon} ${task.name}` !== taskName);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                
                loadTasks();
            }
        }
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
});