document.addEventListener("DOMContentLoaded", function () {
    // Task Class
    class Task {
      static lastId = 0;
  
      constructor(name, status = "To Do", assigned = "") {
        this.id = Task.generateId();
        this.name = name;
        this.status = status;
        this.assigned = assigned;
      }
  
      static generateId() {
        return ++Task.lastId;
      }
  
      // Getters
      getId() { return this.id }
      getName() { return this.name }
      getStatus() { return this.status }
      getAssigned() { return this.assigned }
  
      // Setters
      setName(name) { this.name = name }
      setStatus(status) { this.status = status }
      setAssigned(assigned) { this.assigned = assigned }
    }
  
    // Task Management
    let tasks = [];
    const taskModal = document.getElementById("taskModal");
    const taskForm = document.getElementById("taskForm");
    const createTaskBtn = document.querySelector(".backlog-content .create-issue-button");
    const issueContainer = document.querySelector(".backlog-content .issue-container");
    const taskCountElement = document.querySelector(".backlog-content > div:first-child p");
  
    // Modal Handling
    createTaskBtn.addEventListener("click", () => {
      taskModal.style.display = "block";
    });
  
    document.querySelector(".cancel-btn").addEventListener("click", () => {
      taskModal.style.display = "none";
    });
  
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskName = document.getElementById("taskName").value;
      const taskStatus = document.getElementById("taskStatus").value;
      const taskAssigned = document.getElementById("taskAssigned").value;
  
      const newTask = new Task(taskName, taskStatus, taskAssigned);
      tasks.push(newTask);
      updateTaskDisplay();
      taskModal.style.display = "none";
      taskForm.reset();
    });
  
    // Update UI
    function updateTaskDisplay() {
      issueContainer.innerHTML = "";
      tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = "task-item";
        taskElement.innerHTML = `
          <span>${task.name}</span>
          <span>Status: ${task.status}</span>
          <span>Assigned: ${task.assigned || "Unassigned"}</span>
        `;
        issueContainer.appendChild(taskElement);
      });
      taskCountElement.textContent = `${tasks.length} ${tasks.length === 1 ? "Task" : "Tasks"}`;
    }
  
    // Close modal on outside click
    window.addEventListener("click", (e) => {
      if (e.target === taskModal) {
        taskModal.style.display = "none";
      }
    });
  });