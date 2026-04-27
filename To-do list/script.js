
const input = document.querySelector('#card-text-input');
const addBtn = document.querySelector('.add-card');
const list = document.querySelector('.to-do-list');

let tasks = JSON.parse(localStorage.getItem('myObjectTasks')) || [];

function renderTasks() {
    list.innerHTML = tasks.map((task, index) => `
        <li class="todo-item ${task.completed ? 'done':''}">
            <span class="class-text" data-index="${index}">${task.text}</span>
            <button class="delete-single" data-index="${index}">X</button>
        </li>
    `).join("");

    localStorage.setItem('myObjectTasks', JSON.stringify(tasks));
}

addBtn.addEventListener('click', addNewTask );
function addNewTask()  {
    const newTask = input.value.trim();

    if (newTask !== "") {
        tasks.push({text: newTask, completed: false});
        input.value = "";
        renderTasks();
    }
}
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addNewTask();
    }
});
list.addEventListener('click', (event) => {
    if(event.target.classList.contains('class-text')) {
        const index = event.target.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }
    if (event.target.classList.contains('delete-single')) {
        const index = event.target.dataset.index;
        tasks.splice(index, 1);
        renderTasks();
    }
})
renderTasks();

