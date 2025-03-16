document.addEventListener("DOMContentLoaded", function () {
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

