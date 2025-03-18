console.log("For backlog page");

// Sprint Modal Handling
function openModal() {
    const modal = document.getElementById("sprintModal");
    if (modal) modal.style.display = "block";
}

function closeModal() {
    resetModal();
    const modal = document.getElementById("sprintModal");
    if (modal) modal.style.display = "none";
}

let sprintCounter = 1;

function addSprint() {
    const name = document.getElementById("sprintName")?.value;
    const startDate = document.getElementById("startDate")?.value;
    const endDate = document.getElementById("endDate")?.value;

    if (!name || !startDate || !endDate) {
        alert("There's missing fields!");
        return;
    }

    const sprintId = `sprint-${sprintCounter++}`;
    const sprintContainer = document.createElement("div");
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
        <div class="issue-container">
            <p>Your backlog is empty.</p>
        </div>
        <div>
            <button class="create-issue-button">+ Create Task</button>
        </div>
    `;

    document.querySelector(".sprint-list-container")?.prepend(sprintContainer);
    closeModal();
}

function removeSprint(button) {
    button?.parentElement?.parentElement?.remove();
}

function toggleTaskContent(header) {
    const content = header?.nextElementSibling;
    if (content) content.style.display = content.style.display === "none" ? "block" : "none";
}

function resetModal() {
    document.getElementById("sprintForm")?.reset();
}

// Task Management
document.addEventListener("DOMContentLoaded", function () {
    class Task {
        static lastId = 0;
        constructor(name, status = "To Do", assigned = "") {
            this.id = ++Task.lastId;
            this.name = name;
            this.status = status;
            this.assigned = assigned;
        }
    }

    let backlogTasks = [];
    const taskModal = document.getElementById("taskModal");
    const taskForm = document.getElementById("taskForm");
    const createTaskBtn = document.querySelector(".backlog-content .create-issue-button");
    const issueContainer = document.querySelector(".backlog-content .issue-container");

    if (createTaskBtn) {
        createTaskBtn.addEventListener("click", () => {
            if (taskModal) taskModal.style.display = "block";
        });
    }

    document.querySelector("#taskModal .cancel-btn")?.addEventListener("click", () => {
        if (taskModal) taskModal.style.display = "none";
    });

    taskForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskName = document.getElementById("taskName")?.value;
        const taskStatus = document.getElementById("taskStatus")?.value;
        const taskAssigned = document.getElementById("taskAssigned")?.value;

        if (taskName) {
            const newTask = new Task(taskName, taskStatus, taskAssigned);
            backlogTasks.push(newTask);
            updateTaskDisplay();
            if (taskModal) taskModal.style.display = "none";
            taskForm.reset();
        }
    });

    function updateTaskDisplay() {
        if (!issueContainer) return;
        issueContainer.innerHTML = backlogTasks.length === 0 
            ? "<p>Your backlog is empty.</p>" 
            : backlogTasks.map(task => `
                <div class="task-item">
                    <div class="task-details">
                        <span>${task.name}</span>
                        <span>Status: ${task.status}</span>
                        <span>Assigned: ${task.assigned || "Unassigned"}</span>
                    </div>
                    <button class="delete-task" data-id="${task.id}">Delete</button>
                </div>
            `).join("");

        document.querySelectorAll(".delete-task").forEach(btn => {
            btn.addEventListener("click", function () {
                backlogTasks = backlogTasks.filter(t => t.id !== Number(this.dataset.id));
                updateTaskDisplay();
            });
        });
    }
});

// BOARD.JS
const board = document.querySelector(".board");
if (board) {
    const addColumnBtn = document.createElement("button");
    addColumnBtn.id = "addColumnBtn";
    addColumnBtn.classList.add("add-column");
    addColumnBtn.textContent = "+";

    let kanbanColumns = ["TO DO", "IN PROGRESS", "DONE"];

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

        columnHeader.appendChild(titleSpan);
        newColumn.appendChild(columnHeader);
        newColumn.appendChild(createTaskBtn);
        newColumn.appendChild(taskContainer);

        board.appendChild(newColumn);
        createTaskBtn.addEventListener("click", () => openTaskModal(taskContainer));
    }

    function openTaskModal(taskContainer) {
        const taskName = prompt("Enter task name:");
        if (taskName) {
            addTaskToColumn(taskContainer, taskName);
        }
    }

    function addTaskToColumn(taskContainer, taskName) {
        if (!taskContainer) return;
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        taskItem.textContent = taskName;
        taskContainer.appendChild(taskItem);
    }

    renderBoard();
}