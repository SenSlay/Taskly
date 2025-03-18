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
  let backlogTasks = [];
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
      backlogTasks.push(newTask);
      updateTaskDisplay();
      taskModal.style.display = "none";
      taskForm.reset();
  });

  // UI for updating tasks
  function updateTaskDisplay() {
      issueContainer.innerHTML = "";
      if (backlogTasks.length === 0) {
          issueContainer.innerHTML = "<p>Your backlog is empty.</p>";
      } else {
          backlogTasks.forEach(task => {
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
                  backlogTasks = backlogTasks.filter(t => t.id !== task.id);
                  updateTaskDisplay();
              });

              issueContainer.appendChild(taskElement);
          });
      }
      taskCountElement.textContent = `${backlogTasks.length} ${backlogTasks.length === 1 ? "Task" : "Tasks"}`;
  }

  // Close modal on outside click
  window.addEventListener("click", (e) => {
      if (e.target === taskModal) {
          taskModal.style.display = "none";
      }
  });

  // BACKLOG.JS CODE STARTING FROM HERE
  const addColumnBtn = document.createElement("button");
  addColumnBtn.id = "addColumnBtn";
  addColumnBtn.classList.add("add-column");
  addColumnBtn.textContent = "+";
  
  const board = document.querySelector(".board");
  if (!board) {
      console.error("Board element not found");
      return;
  }

  let kanbanColumns = ["TO DO", "IN PROGRESS", "DONE"];

  // Create modal elements
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const taskNameInput = document.createElement("input");
  taskNameInput.placeholder = "Task Name";
  const assigneeInput = document.createElement("input");
  assigneeInput.placeholder = "Assignee Name";

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Create Task";

  const closeModalBtn = document.createElement("button");
  closeModalBtn.textContent = "Close";

  modalContent.appendChild(taskNameInput);
  modalContent.appendChild(assigneeInput);
  modalContent.appendChild(submitBtn);
  modalContent.appendChild(closeModalBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Hide the modal initially
  modal.style.display = "none";

  function renderBoard() {
      board.innerHTML = "";
      kanbanColumns.forEach(name => createColumn(name));
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

      const taskContainer = document.createElement("div");
      taskContainer.classList.add("task-container");
      
      // Enable the task container to accept drops
      taskContainer.addEventListener("dragover", function (e) {
          e.preventDefault();  // Allow drop
      });

      taskContainer.addEventListener("drop", function (e) {
          e.preventDefault();
          const draggedTask = document.querySelector(".dragging");
          taskContainer.appendChild(draggedTask);  // Move the task to the new column
      });

      columnHeader.appendChild(titleSpan);
      newColumn.appendChild(columnHeader);
      newColumn.appendChild(createTaskBtn);
      newColumn.appendChild(taskContainer);

      board.appendChild(newColumn);

      addMenuToColumn(newColumn);
      makeColumnsEditable();

      // Add the event listener for creating tasks
      createTaskBtn.addEventListener("click", function () {
          // Pass the taskContainer of the current column to the modal
          openModal(taskContainer);
      });
  }

  function addTaskToColumn(taskContainer, taskName, assignee) {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");
      taskItem.setAttribute('draggable', true);
      
      // Add the class to mark it as being dragged
      taskItem.addEventListener('dragstart', function () {
          taskItem.classList.add('dragging');
      });
      
      taskItem.addEventListener('dragend', function () {
          taskItem.classList.remove('dragging');
      });

      // Create a text display for both task name and assignee
      const taskText = document.createElement("span");
      taskText.textContent = `${taskName} (Assigned to: ${assignee})`;

      // Create a delete button for the task
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "x";

      // Add an event listener for the delete button
      deleteBtn.addEventListener("click", function () {
          taskContainer.removeChild(taskItem);  // Remove the task item from the container
      });

      // Append the task text and delete button to the task item
      taskItem.appendChild(taskText);
      taskItem.appendChild(deleteBtn);

      // Append the task item to the task container
      taskContainer.appendChild(taskItem);
  }

  // Open the modal when "Create Task" is clicked
  function openModal(taskContainer) {
      modal.style.display = "block";
      // Clear previous inputs
      taskNameInput.value = "";
      assigneeInput.value = "";

      // Add event listener for submit button
      submitBtn.onclick = function () {
          const taskName = taskNameInput.value.trim();
          const assignee = assigneeInput.value.trim() || "Unassigned";

          if (taskName) {
              addTaskToColumn(taskContainer, taskName, assignee);
              modal.style.display = "none"; // Close the modal after creating the task
          }
      };
  }

  // Close the modal when clicking the "Close" button
  closeModalBtn.addEventListener("click", function () {
      modal.style.display = "none";
  });

  function addMenuToColumn(column) {
      const columnHeader = column.querySelector(".column-header");

      if (!columnHeader.querySelector(".menu-btn")) {
          const menuBtn = document.createElement("button");
          menuBtn.classList.add("menu-btn");
          menuBtn.innerHTML = "⋮";

          const menuDropdown = document.createElement("div");
          menuDropdown.classList.add("menu-dropdown");
          menuDropdown.style.display = "none";

          const renameOption = document.createElement("div");
          renameOption.classList.add("menu-option");
          renameOption.textContent = "Rename";

          const deleteOption = document.createElement("div");
          deleteOption.classList.add("menu-option");
          deleteOption.textContent = "Delete";

          menuDropdown.appendChild(renameOption);
          menuDropdown.appendChild(deleteOption);
          columnHeader.appendChild(menuBtn);
          columnHeader.appendChild(menuDropdown);

          menuBtn.addEventListener("click", function (event) {
              event.stopPropagation();
              closeAllMenus();
              menuDropdown.style.display = "block";
          });

          renameOption.addEventListener("click", function () {
              editColumnName(columnHeader.querySelector("span"));
              menuDropdown.style.display = "none";
          });

          deleteOption.addEventListener("click", function () {
              const index = kanbanColumns.indexOf(columnHeader.querySelector("span").textContent);
              if (index !== -1) {
                  kanbanColumns.splice(index, 1);
                  renderBoard();
              }
          });

          document.addEventListener("click", function () {
              menuDropdown.style.display = "none";
          });
      }
  }

  function addTaskToColumn(taskContainer, taskName, assignee) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.setAttribute('draggable', true);
    
    // Add the class to mark it as being dragged
    taskItem.addEventListener('dragstart', function () {
        taskItem.classList.add('dragging');
    });
    
    taskItem.addEventListener('dragend', function () {
        taskItem.classList.remove('dragging');
    });

    // Create a text display for both task name and assignee
    const taskText = document.createElement("span");
    taskText.textContent = `${taskName} (Assigned to: ${assignee})`;

    // Create a delete button for the task
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "x";

    // Add an event listener for the delete button
    deleteBtn.addEventListener("click", function () {
        taskContainer.removeChild(taskItem);  // Remove the task item from the container
    });

    // Append the task text and delete button to the task item
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);

    // Append the task item to the task container
    taskContainer.appendChild(taskItem);
}

// Open the modal when "Create Task" is clicked
function openModal(taskContainer) {
    modal.style.display = "block";
    // Clear previous inputs
    taskNameInput.value = "";
    assigneeInput.value = "";

    // Add event listener for submit button
    submitBtn.onclick = function () {
        const taskName = taskNameInput.value.trim();
        const assignee = assigneeInput.value.trim() || "Unassigned";

        if (taskName) {
            addTaskToColumn(taskContainer, taskName, assignee);
            modal.style.display = "none"; // Close the modal after creating the task
        }
    };
}

// Close the modal when clicking the "Close" button
closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

  

  function makeColumnsEditable() {
      document.querySelectorAll(".column-header span").forEach(title => {
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

      input.addEventListener("blur", function () {
          saveColumnName(title, input);
      });

      input.addEventListener("keypress", function (event) {
          if (event.key === "Enter") {
              saveColumnName(title, input);
          }
      });
  }

  function saveColumnName(header, input) {
      const newText = input.value.trim() || "Untitled Column";
      const index = kanbanColumns.indexOf(header.textContent);
      if (index !== -1) {
          kanbanColumns[index] = newText;
      }
      header.textContent = newText;
  }

  function closeAllMenus() {
      document.querySelectorAll(".menu-dropdown").forEach(menu => {
          menu.style.display = "none";
      });
  }

  addColumnBtn.addEventListener("click", function () {
      const columnName = prompt("Enter column name:").trim();
      if (columnName) {
          kanbanColumns.push(columnName);
          renderBoard();
      }
  });

  renderBoard();
});