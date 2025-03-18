console.log("For backlog page");

// Load Data from Local Storage
let sprints = JSON.parse(localStorage.getItem("sprints")) || [];
let backlogTasks = JSON.parse(localStorage.getItem("backlogTasks")) || [];
let kanbanColumns = ["TO DO", "IN PROGRESS", "COMPLETED"];

console.log("Loaded sprints from localStorage:", sprints);

function saveData() {
    localStorage.setItem("sprints", JSON.stringify(sprints));
    console.log("Saved sprints:", sprints);
}

// Function to Render Task Status Options in Modal
function renderModalTaskStatus() {
    let taskStatusSelect = document.getElementById("taskStatus");

    if (!taskStatusSelect) {
        console.warn("taskStatus select element not found. Skipping renderModalTaskStatus.");
        return;
    }

    taskStatusSelect.innerHTML = ""; // Clear previous options

    kanbanColumns.forEach(status => {
        let option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        taskStatusSelect.appendChild(option);
    });
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", renderModalTaskStatus);

function renderSprints() {
  const sprintListContainer = document.querySelector(".sprint-list-container");
  if (!sprintListContainer) return;

  sprintListContainer.innerHTML = ""; // Clear existing content

  sprints.forEach((sprint, index) => {
      if (!sprint.tasks) sprint.tasks = []; // Ensure tasks array exists

      console.log(`Rendering Sprint: ${sprint.name}, Tasks:`, sprint.tasks); // Debugging

      const sprintContainer = document.createElement("div");
      sprintContainer.className = "sprint-container";
      sprintContainer.id = sprint.id;

      console.log(sprint.tasks.length);

      sprintContainer.innerHTML = `
          <div class="sprint-header">
              <h2>${sprint.name}</h2>
              <div>
                  <p><strong>Start:</strong> ${sprint.startDate}</p>
                  <p><strong>End:</strong> ${sprint.endDate}</p>
              </div>
              <button class="button complete-btn" data-index="${index}">Complete Sprint</button>
          </div>
          <div class="issue-container">
              ${sprint.tasks.length > 0 
                  ? sprint.tasks.map(task => taskTemplate(task, index)).join("")
                  : "This sprint has no tasks."}
          </div>
          <div>
            <button class="create-issue-button" data-index="${index}">+ Create Task</button>
          </div>
      `;
      sprintListContainer.prepend(sprintContainer);
  });

  addSprintEventListeners();
  console.log("Rendered sprints:", sprints); // Debugging
}


// Template for Task Items
function taskTemplate(task, sprintIndex) {
    return `
        <div class="task-item">
            <div class="task-details">
                <span>${task.name}</span>
                <span>Status: ${task.status}</span>
                <span>Assigned: ${task.assigned || "Unassigned"}</span>
            </div>
            <button class="edit-task" data-task-id="${task.id}" data-sprint-index="${sprintIndex}">Edit</button>
            <button class="delete-task" data-task-id="${task.id}">Delete</button>
        </div>
    `;
}

function openEditTaskModal(taskId, sprintIndex) {
  const task = sprints[sprintIndex].tasks.find(t => t.id == taskId);
  if (!task) return;

  document.querySelector(".task-modal-title").textContent = "Edit Modal"
  document.querySelector(".task-modal-add-btn").textContent = "Save Edit"

  document.getElementById("taskName").value = task.name;
  document.getElementById("taskStatus").value = task.status;
  document.getElementById("taskAssigned").value = task.assigned || "";

  // Change form behavior to update existing task
  document.getElementById("taskForm").onsubmit = function (e) {
      e.preventDefault();
      saveTaskEdits(taskId, sprintIndex);
  };

  document.getElementById("taskModal").style.display = "block";
}

function saveTaskEdits(taskId, sprintIndex) {
  const task = sprints[sprintIndex].tasks.find(t => t.id == taskId);
  if (!task) return;

  task.name = document.getElementById("taskName").value;
  task.status = document.getElementById("taskStatus").value;
  task.assigned = document.getElementById("taskAssigned").value;

  saveData();
  renderSprints();

  document.getElementById("taskModal").style.display = "none";
  document.getElementById("taskForm").reset();
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-task")) {
      console.log(e.target)
      const taskId = e.target.dataset.taskId;
      const sprintIndex = e.target.dataset.sprintIndex;
      openEditTaskModal(taskId, sprintIndex);
  }
});

// Create a New Sprint
function addSprint() {
    const name = document.getElementById("sprintName")?.value;
    const startDate = document.getElementById("startDate")?.value;
    const endDate = document.getElementById("endDate")?.value;

    if (!name || !startDate || !endDate) {
        alert("There's missing fields!");
        return;
    }

    const sprint = {
        id: `sprint-${Date.now()}`,
        name,
        startDate,
        endDate,
        tasks: [] // Ensure tasks array is initialized
    };

    sprints.push(sprint);
    saveData();
    renderSprints();
    closeModal();
}

// Attach Event Listeners
function addSprintEventListeners() {
    document.querySelectorAll(".complete-btn").forEach(button => {
        button.addEventListener("click", function () {
            const index = this.dataset.index;
            sprints.splice(index, 1);
            saveData();
            renderSprints();
        });
    });

    document.querySelectorAll(".create-issue-button").forEach(button => {
        button.addEventListener("click", function () {
            openTaskModal(this.dataset.index);
        });
    });

    document.querySelectorAll(".delete-task").forEach(button => {
        button.addEventListener("click", function () {
            const taskId = Number(this.dataset.taskId);
            sprints.forEach(sprint => {
                sprint.tasks = sprint.tasks.filter(task => task.id !== taskId);
            });
            saveData();
            renderSprints();
        });
    });
}

// Open Task Modal
function openTaskModal(sprintIndex) {
    const taskModal = document.getElementById("taskModal");
    if (taskModal) taskModal.style.display = "block";

    document.getElementById("taskForm").onsubmit = function (e) {
        e.preventDefault();
        addTask(sprintIndex);
    };
}

// Add Task to Sprint
function addTask(sprintIndex) {
    const taskName = document.getElementById("taskName")?.value;
    const taskStatus = document.getElementById("taskStatus")?.value;
    const taskAssigned = document.getElementById("taskAssigned")?.value;

    if (!taskName) return;

    const newTask = {
        id: Date.now(),
        name: taskName,
        status: taskStatus || "TO DO",
        assigned: taskAssigned || "Unassigned"
    };

    if (!sprints[sprintIndex].tasks) sprints[sprintIndex].tasks = []; // Ensure tasks array exists

    sprints[sprintIndex].tasks.push(newTask);
    saveData();
    renderSprints();

    document.getElementById("taskModal").style.display = "none";
    document.getElementById("taskForm").reset();
}

// Initialize Page
document.addEventListener("DOMContentLoaded", function () {
    renderSprints();
});

// Modal Handling
function openModal() {
    document.getElementById("sprintModal").style.display = "block";
}

function closeModal() {
    document.getElementById("sprintModal").style.display = "none";
    document.getElementById("sprintForm").reset();
}

document.querySelector("#taskModal .cancel-btn")?.addEventListener("click", () => {
    document.getElementById("taskModal").style.display = "none";
});

document.querySelector("#sprintModal .cancel-btn")?.addEventListener("click", closeModal);


// Function to Save Data
function saveData() {
  localStorage.setItem("sprints", JSON.stringify(sprints));
  localStorage.setItem("backlogTasks", JSON.stringify(backlogTasks));
}

function renderBacklogTasks() {
  const backlogContainer = document.querySelector(".backlog-container"); 
  if (!backlogContainer) return; 

  const issueContainer = backlogContainer.querySelector(".issue-container");
  if (!issueContainer) return;

  issueContainer.innerHTML = backlogTasks.length === 0 
      ? "<p>Your backlog is empty.</p>" 
      : backlogTasks.map(taskTemplate).join("");

  addBacklogTaskEventListeners();
}

// Function to Add a Backlog Task
function addBacklogTask() {
  const taskName = document.getElementById("taskName")?.value;
  const taskStatus = document.getElementById("taskStatus")?.value;
  const taskAssigned = document.getElementById("taskAssigned")?.value;

  if (!taskName) return;

  const newTask = {
      id: Date.now(),
      name: taskName,
      status: taskStatus || "TO DO",
      assigned: taskAssigned || "Unassigned"
  };

  backlogTasks.push(newTask);
  saveData();
  renderBacklogTasks();

  document.getElementById("taskModal").style.display = "none";
  document.getElementById("taskForm").reset();
}

// Function to Delete Backlog Task
function deleteBacklogTask(taskId) {
  backlogTasks = backlogTasks.filter(task => task.id !== taskId);
  saveData();
  renderBacklogTasks();
}

// Event Listeners for Backlog Task Deletion
function addBacklogTaskEventListeners() {
  document.querySelectorAll(".delete-task").forEach(button => {
      button.addEventListener("click", function () {
          const taskId = Number(this.dataset.taskId);
          deleteBacklogTask(taskId);
      });
  });
}

// Open Task Modal for Backlog
document.querySelector(".create-backlog-task-button")?.addEventListener("click", () => {
  document.getElementById("taskModal").style.display = "block";
  document.getElementById("taskForm").onsubmit = function (e) {
      e.preventDefault();
      addBacklogTask();
  };
});

// Initialize Backlog Task List on Page Load
document.addEventListener("DOMContentLoaded", renderBacklogTasks);






// BOARD.JS
const board = document.querySelector(".board");
if (board) {
  const addColumnBtn = document.createElement("button");
  addColumnBtn.id = "addColumnBtn";
  addColumnBtn.classList.add("add-column");
  addColumnBtn.textContent = "+";

  // Create modal elements
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.style.display = "none";

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const taskNameInput = document.createElement("input");
  taskNameInput.placeholder = "Task Name";
  const assigneeInput = document.createElement("input");
  assigneeInput.placeholder = "Assignee Name";

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Create Task";
  submitBtn.addEventListener("click", handleTaskSubmit);

  const closeModalBtn = document.createElement("button");
  closeModalBtn.textContent = "Close";
  closeModalBtn.addEventListener("click", () => (modal.style.display = "none"));

  modalContent.append(taskNameInput, assigneeInput, submitBtn, closeModalBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  function renderBoard() {
      board.innerHTML = "";
      kanbanColumns.forEach(createColumn);
      board.appendChild(addColumnBtn);
  }

  function createColumn(name) {
      const newColumn = document.createElement("div");
      newColumn.classList.add("column");

      const columnHeader = document.createElement("div");
      columnHeader.classList.add("column-header");

      const titleSpan = document.createElement("span");
      titleSpan.textContent = name;

      const createTaskBtn = document.createElement("button");
      createTaskBtn.classList.add("create-task");
      createTaskBtn.textContent = "+ Create Task";
      createTaskBtn.addEventListener("click", () => openModal(newColumn.querySelector(".task-container")));

      const taskContainer = document.createElement("div");
      taskContainer.classList.add("task-container");

      // Enable drag-and-drop functionality
      taskContainer.addEventListener("dragover", (e) => e.preventDefault());
      taskContainer.addEventListener("drop", handleTaskDrop);

      columnHeader.appendChild(titleSpan);
      newColumn.append(columnHeader, createTaskBtn, taskContainer);

      board.appendChild(newColumn);
      addMenuToColumn(newColumn);
      makeColumnsEditable();
  }

  function addTaskToColumn(taskContainer, taskName, assignee) {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");
      taskItem.setAttribute("draggable", true);
      taskItem.innerHTML = `<span>${taskName} (Assigned to: ${assignee})</span>`;

      taskItem.addEventListener("dragstart", () => taskItem.classList.add("dragging"));
      taskItem.addEventListener("dragend", () => taskItem.classList.remove("dragging"));

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "x";
      deleteBtn.addEventListener("click", () => taskContainer.removeChild(taskItem));

      taskItem.appendChild(deleteBtn);
      taskContainer.appendChild(taskItem);
  }

  function handleTaskDrop(event) {
      event.preventDefault();
      const draggedTask = document.querySelector(".dragging");
      event.currentTarget.appendChild(draggedTask);
  }

  function openModal(taskContainer) {
      modal.style.display = "block";
      taskNameInput.value = "";
      assigneeInput.value = "";
      submitBtn.onclick = () => handleTaskSubmit(taskContainer);
  }

  function handleTaskSubmit(taskContainer) {
      const taskName = taskNameInput.value.trim();
      const assignee = assigneeInput.value.trim() || "Unassigned";
      if (taskName) {
          addTaskToColumn(taskContainer, taskName, assignee);
          modal.style.display = "none";
      }
  }

  function addMenuToColumn(column) {
      const columnHeader = column.querySelector(".column-header");

      if (columnHeader.querySelector(".menu-btn")) return;

      const menuBtn = document.createElement("button");
      menuBtn.classList.add("menu-btn");
      menuBtn.innerHTML = "⋮";

      const menuDropdown = document.createElement("div");
      menuDropdown.classList.add("menu-dropdown");
      menuDropdown.style.display = "none";

      const renameOption = document.createElement("div");
      renameOption.classList.add("menu-option");
      renameOption.textContent = "Rename";
      renameOption.addEventListener("click", () => editColumnName(columnHeader.querySelector("span")));

      const deleteOption = document.createElement("div");
      deleteOption.classList.add("menu-option");
      deleteOption.textContent = "Delete";
      deleteOption.addEventListener("click", () => deleteColumn(column));

      menuDropdown.append(renameOption, deleteOption);
      columnHeader.append(menuBtn, menuDropdown);

      menuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          closeAllMenus();
          menuDropdown.style.display = "block";
      });

      document.addEventListener("click", () => (menuDropdown.style.display = "none"));
  }

  function makeColumnsEditable() {
      document.querySelectorAll(".column-header span").forEach((title) => {
          title.removeEventListener("click", handleTitleClick);
          title.addEventListener("click", handleTitleClick);
      });
  }

  function handleTitleClick(event) {
      editColumnName(event.target);
  }

  function editColumnName(title) {
      if (title.querySelector("input")) return;

      const currentText = title.textContent.trim();
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentText;
      input.classList.add("edit-column-input");

      title.innerHTML = "";
      title.appendChild(input);
      input.focus();

      input.addEventListener("blur", () => saveColumnName(title, input));
      input.addEventListener("keypress", (e) => e.key === "Enter" && saveColumnName(title, input));
  }

  function saveColumnName(header, input) {
      const newText = input.value.trim() || "Untitled Column";
      const index = kanbanColumns.indexOf(header.textContent);
      if (index !== -1) {
          kanbanColumns[index] = newText;
      }
      header.textContent = newText;
  }

  function deleteColumn(column) {
      const index = kanbanColumns.indexOf(column.querySelector(".column-header span").textContent);
      if (index !== -1) {
          kanbanColumns.splice(index, 1);
          renderBoard();
      }
  }

  function closeAllMenus() {
      document.querySelectorAll(".menu-dropdown").forEach((menu) => (menu.style.display = "none"));
  }

  addColumnBtn.addEventListener("click", function () {
      const columnName = prompt("Enter column name:").trim();
      if (columnName) {
          kanbanColumns.push(columnName);
          renderBoard();
      }
  });

  renderBoard();
}