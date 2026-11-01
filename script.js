
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

let tasks = JSON.parse(localStorage.getItem("smartTasks")) || [];

const today = new Date();
const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

taskDueDate.min = todayString;
taskDueDate.value = todayString;

document.getElementById("todayDate").textContent =
    today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

function saveTasks() {
    localStorage.setItem("smartTasks", JSON.stringify(tasks));
}

function formatDate(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function addTask(event) {
    event.preventDefault();

    const title = taskTitle.value.trim();

    if (!title) {
        alert("Please enter a task name.");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        category: taskCategory.value,
        priority: taskPriority.value,
        dueDate: taskDueDate.value,
        completed: false
    };

    tasks.push(task);
    saveTasks();

    taskForm.reset();
    taskPriority.value = "Medium";
    taskDueDate.value = todayString;

    displayTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });

    saveTasks();
    displayTasks();
}

function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        displayTasks();
    }
}

function editTask(id) {
    const task = tasks.find(item => item.id === id);

    if (!task) return;

    const newTitle = prompt("Edit task name:", task.title);

    if (newTitle === null) return;

    if (newTitle.trim() === "") {
        alert("Task name cannot be empty.");
        return;
    }

    task.title = newTitle.trim();
    saveTasks();
    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchText) ||
            task.category.toLowerCase().includes(searchText);

        const matchesFilter =
            filterValue === "All" ||
            (filterValue === "Done" && task.completed) ||
            (filterValue === "Pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    document.getElementById("taskSummary").textContent =
        `${filteredTasks.length} task(s)`;

    if (filteredTasks.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent = "No tasks found. Add a new task to get started!";
        taskList.appendChild(empty);
    }

    filteredTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-item";

        if (task.completed) {
            card.classList.add("completed");
        }

        const details = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = task.title;

        const category = document.createElement("p");
        category.textContent = `Category: ${task.category}`;

        const priority = document.createElement("p");
        priority.className = `priority ${task.priority}`;
        priority.textContent = `Priority: ${task.priority}`;

        const due = document.createElement("p");
        const isOverdue = !task.completed && task.dueDate < todayString;

        due.textContent = `Due Date: ${formatDate(task.dueDate)}`;

        if (isOverdue) {
            due.classList.add("overdue");
            due.textContent += " (Overdue)";
        }

        details.append(heading, category, priority, due);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.addEventListener("click", () => toggleTask(task.id));

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editTask(task.id));

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        actions.append(completeButton, editButton, deleteButton);
        card.append(details, actions);
        taskList.appendChild(card);
    });

    updateDashboard();
}

function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    const overdue = tasks.filter(task =>
        !task.completed && task.dueDate < todayString
    ).length;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalCount").textContent = total;
    document.getElementById("doneCount").textContent = completed;
    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("overdueCount").textContent = overdue;
const todayTasks = tasks.filter(task =>
    task.dueDate === todayString
);

const todayCompleted = todayTasks.filter(task =>
    task.completed
).length;

const productivityScore = todayTasks.length === 0
    ? 0
    : Math.round((todayCompleted / todayTasks.length) * 100);

document.getElementById("productivityScore").textContent =
    `${productivityScore}%`;

document.getElementById("productivityScore").textContent =
    `${productivityScore}%`;
    document.getElementById("progressText").textContent =
        `${progress}%`;

    document.getElementById("progressFill").style.width =
        `${progress}%`;
}

taskForm.addEventListener("submit", addTask);
searchInput.addEventListener("input", displayTasks);
filterSelect.addEventListener("change", displayTasks);

displayTasks();
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
    }
});