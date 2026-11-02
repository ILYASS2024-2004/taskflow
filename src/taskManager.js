const TaskManager = (() => {
     function createTask(title) {
    if (typeof title !== "string" || title.trim() === "") {
      throw new Error("Task title is required");
    }
 
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: title.trim(),
      completed: false
    };
  }
 
  function deleteTask(tasks, id) {
    return tasks.filter((task) => task.id !== id);
  }
 
  function editTask(tasks, id, newTitle) {
    if (typeof newTitle !== "string" || newTitle.trim() === "") {
      throw new Error("Task title is required");
    }
 
    return tasks.map((task) =>
      task.id === id ? { ...task, title: newTitle.trim() } : task
    );
  }
 
  function toggleTask(tasks, id) {
    return tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
  }
 
  function filterTasks(tasks, filter) {
    if (filter === "pending") {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }
    return [...tasks];
  }
 
  return { createTask, deleteTask, editTask, toggleTask, filterTasks };
})();
 
// Le même module fonctionne dans le navigateur et dans Jest.
if (typeof module !== "undefined" && module.exports) {
  module.exports = TaskManager;
}
if (typeof window !== "undefined") {
  window.TaskManager = TaskManager;
}