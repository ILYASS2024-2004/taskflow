// La logique métier sera ajoutée dans une prochaine Pull Request.
const {
  createTask,
  deleteTask,
  editTask,
  toggleTask,
  filterTasks
} = require("../src/taskManager");
describe("TaskFlow task manager", () => {
  test("creates a task and trims its title", () => {
    const task = createTask("  Learn Git  ");
    expect(task.title).toBe("Learn Git");
    expect(task.completed).toBe(false);
    expect(task.id).toBeTruthy();
  });
  test("rejects an empty task title", () => {
    expect(() => createTask("   ")).toThrow("Task title is required");
  });
  test("deletes only the selected task", () => {
    const tasks = [  { id: "1", title: "First", completed: false },
      { id: "2", title: "Second", completed: false }
    ];
    const result = deleteTask(tasks, "1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });
 
  test("edits a task and trims the new title", () => {
    const tasks = [{ id: "1", title: "Old", completed: false }];
    const result = editTask(tasks, "1", "  New title  ");
    expect(result[0].title).toBe("New title");
  });
 
  test("rejects an empty edited title", () => {
    const tasks = [{ id: "1", title: "Old", completed: false }];
    expect(() => editTask(tasks, "1", " ")).toThrow("Task title is required");
  });
 
  test("toggles a task status", () => {
    const tasks = [{ id: "1", title: "Task", completed: false }];
    const result = toggleTask(tasks, "1");
    expect(result[0].completed).toBe(true);
  });
 
  test("filters pending tasks", () => {
    const tasks = [
      { id: "1", title: "Done", completed: true },
      { id: "2", title: "Todo", completed: false }
    ];
    const result = filterTasks(tasks, "pending");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });
 
  test("filters completed tasks", () => {
    const tasks = [
      { id: "1", title: "Done", completed: true },
      { id: "2", title: "Todo", completed: false }
    ];
    const result = filterTasks(tasks, "completed");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });
 
  test("returns every task for the all filter", () => {
    const tasks = [
      { id: "1", title: "First", completed: true },
      { id: "2", title: "Second", completed: false }
    ];
    expect(filterTasks(tasks, "all")).toHaveLength(2);
  });
});