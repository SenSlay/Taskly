console.log("For backlog page")

// AR MAN CODE FOR SPRINT MODAL
function openModal() {
    document.getElementById("sprintModal").style.display = "block";
}

function closeModal() {
    resetModal();
    document.getElementById("sprintModal").style.display = "none";
}

let sprintCounter = 1;

function addSprint() {
    let name = document.getElementById("sprintName").value;
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    let description = document.getElementById("sprintDescription").value;

    if (!name || !startDate || !endDate) {
        alert("There's missing fields!");
        return;
    }

    let sprintId = `sprint-${sprintCounter++}`;

    let sprintContainer = document.createElement("div");
    sprintContainer.className = "backlog-container sprint-container";
    sprintContainer.id = sprintId;
    sprintContainer.innerHTML = `
        <div class="sprint-header" onclick="toggleTaskContent(this)">
            <h2>${name}</h2>
            <div>
              <p><strong>Start:</strong> ${startDate}</p>
              <p><strong>End:</strong> ${endDate}</p>
            </div>
            <button class="button complete-btn" onclick="removeSprint(this)">Complete Sprint</button>
        </div>
        ${/* THIS IS WHERE THE TASKS WILL BE ADDED- RYONAN IS ASSIGNEE*/""}
        <div class="issue-container">
          <p>Your backlog is empty.</p>
        </div>
        <div>
          <button class="create-issue-button" position="left">+ Create Task</button>
        </div>
    `;
   
    document.querySelector(".sprint-list-container").prepend(sprintContainer);
    closeModal();
}


function removeSprint(button) {
    button.parentElement.parentElement.remove();
}

document.getElementById("sprintName").value = "";
document.getElementById("startDate").value = "";
document.getElementById("endDate").value = "";
document.getElementById("sprintDescription").value = "";     

function toggleTaskContent(header) {
    let content = header.nextElementSibling;
    content.style.display = content.style.display === "none" || content.style.display === "" ? "block" : "none";
}

function formatDate(dateStr) {
    let date = new Date(dateStr);
    return date.toLocaleString('en-US', { day: 'numeric', month: 'short' });
}

function resetModal() {
    document.getElementById("sprintForm").reset();
}

// RYONAN'S CODE BELOW
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
  const taskCountElement = document.querySelector(".backlog-container > div:first-child p");

  // Modal Handling
  createTaskBtn.addEventListener("click", () => {
      console.log(taskModal)
      console.log('tet')
      taskModal.style.display = "block";
  });

  document.querySelector("#taskModal .cancel-btn").addEventListener("click", () => {
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

  // UI for updating tasks
  function updateTaskDisplay() {
      issueContainer.innerHTML = "";
      if (tasks.length === 0) {
          issueContainer.innerHTML = "<p>Your backlog is empty.</p>";
      } else {
          tasks.forEach(task => {
              const taskElement = document.createElement("div");
              taskElement.className = "task-item";
              taskElement.innerHTML = `
                  <div class="task-details">
                      <span>${task.name}</span>
                      <span>Status: ${task.status}</span>
                      <span>Assigned: ${task.assigned || "Unassigned"}</span>
                  </div>
                  <button class="delete-task" data-id="${task.id}">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                  </button>
              `;

              // Add delete functionality
              taskElement.querySelector('.delete-task').addEventListener('click', () => {
                  tasks = tasks.filter(t => t.id !== task.id);
                  updateTaskDisplay();
              });

              issueContainer.appendChild(taskElement);
          });
      }
      taskCountElement.textContent = `${tasks.length} ${tasks.length === 1 ? "Task" : "Tasks"}`;
  }

  // Close modal on outside click
  window.addEventListener("click", (e) => {
      if (e.target === taskModal) {
          taskModal.style.display = "none";
      }
  });
});
