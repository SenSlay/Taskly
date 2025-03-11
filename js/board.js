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
    
        const taskContainer = document.createElement("ul");
        taskContainer.classList.add("task-container");
    
        const createTaskBtn = document.createElement("button");
        createTaskBtn.classList.add("create-task");
        createTaskBtn.textContent = "+ Create Task";
    
        columnHeader.appendChild(titleSpan);
        newColumn.appendChild(columnHeader);
        newColumn.appendChild(taskContainer);
        newColumn.appendChild(createTaskBtn);
    
        board.appendChild(newColumn);
    
        addMenuToColumn(newColumn);
        makeColumnsEditable();
    }
    
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

    addColumnBtn.addEventListener("click", function () {
        const columnName = prompt("Enter column name:").trim();
        if (columnName) {
            kanbanColumns.push(columnName);
            renderBoard();
        }
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

    renderBoard();
});
