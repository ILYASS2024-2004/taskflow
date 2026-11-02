import "./src/taskManager.js";
 
const TaskManager = window.TaskManager;
const STORAGE_KEY = "taskflow.tasks";
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll("[data-filter]");
 
let currentFilter = "all";
 
function loadTasks() {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error("Unable to load saved tasks:", error);
    return [];
  }
}
 
let tasks = loadTasks();
 
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Unable to save tasks:", error);
    alert("Impossible de sauvegarder les tâches dans ce navigateur.");
  }
}
 
function createActionButton(label, action, taskId, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `task-action ${extraClass}`.trim();
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = taskId;
  return button;
}
 
function renderTasks() {
  const visibleTasks = TaskManager.filterTasks(tasks, currentFilter);
  taskList.replaceChildren();
 
  const total = tasks.length;
  taskCount.textContent = `${total} tâche${total > 1 ? "s" : ""}`;
 
  if (visibleTasks.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = total === 0
      ? "Aucune tâche pour le moment. Ajoutez votre première tâche !"
      : "Aucune tâche dans ce filtre.";
    taskList.appendChild(emptyMessage);
    return;
  }
 
  visibleTasks.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card";
    if (task.completed) card.classList.add("is-completed");
 
    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;
 
    const actions = document.createElement("div");
  actions.className = "task-actions";
    actions.appendChild(createActionButton(
      task.completed ? "Réactiver" : "Terminer",
      "toggle",
      task.id
    ));
    actions.appendChild(createActionButton("Modifier", "edit", task.id));
    actions.appendChild(createActionButton("Supprimer", "delete", task.id, "danger"));
 
    card.append(title, actions);
    taskList.appendChild(card);
  });
}
 
function refresh() {
  saveTasks();
  renderTasks();
}
 
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const task = TaskManager.createTask(taskInput.value);
    tasks = [...tasks, task];
    taskInput.value = "";
    refresh();
    taskInput.focus();
  } catch (error) {
    alert(error.message);
    taskInput.focus();
  }
});
 
taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
 
  const { action, id } = button.dataset;
 
  if (action === "toggle") {
    tasks = TaskManager.toggleTask(tasks, id);
  }
 
  if (action === "edit") {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    const newTitle = prompt("Nouveau titre :", task.title);
    if (newTitle === null) return;
    try {
      tasks = TaskManager.editTask(tasks, id, newTitle);
    } catch (error) {
      alert(error.message);
      return;
    }
  }
 
  if (action === "delete") {
    const confirmed = confirm("Supprimer cette tâche ?");
    if (!confirmed) return;
    tasks = TaskManager.deleteTask(tasks, id);
  }
 
  refresh();
});
 
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
 currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderTasks();
  });
});
renderTasks();