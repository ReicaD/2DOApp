document.addEventListener("DOMContentLoaded", function () {
  const todoForm = document.querySelector("form");
  const todoInput = document.getElementById("todo-input");
  const todoListUL = document.getElementById("todo-list");

  let allTodos = getTodos();
  //to get to dodo back on the page // This is for the submit event
  updateTodoList();
  todoForm.addEventListener("submit", function (e) {
      // Prevent the default form submission
    e.preventDefault(); 
    addTodo();
  });

  function addTodo() {
    const todoText = todoInput.value.trim();
    // Prevent user from submitting an empty todo
    if (todoText.length > 0) {
      const todoObject = {
        text: todoText,
        completed: false,
      };

      allTodos.push(todoObject);
      updateTodoList();
      saveTodos();
      todoInput.value = "";
    }
  }

  // Updating the submitted value of the todo list
  // Pass both parameters
  function updateTodoList() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
      let todoItem = createTodoItem(todo, todoIndex); 
      todoListUL.append(todoItem);
    });
  }

  function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo border-b border-base-200 last:border-none py-2";
    todoLI.innerHTML = `
      <div class="flex items-center justify-between w-full p-2 hover:bg-base-200 rounded-lg transition-colors group">
          <div class="flex items-center gap-4 flex-grow">
              <input type="checkbox" id="${todoId}" class="checkbox checkbox-accent checkbox-md" ${todo.completed ? 'checked' : ''} />
              <label for="${todoId}" class="todo-text text-lg cursor-pointer ${todo.completed ? 'line-through text-base-content/50' : 'text-base-content'}">
                ${todoText}
              </label>
          </div>
          <button class="delete-button btn btn-ghost btn-sm btn-circle text-error opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"> 
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
          </button>
      </div>
    `;

    const deleteButton = todoLI.querySelector(".delete-button");
    //this deletes the todo Button
    deleteButton.addEventListener("click", () => {
      deleteTodoItem(todoIndex);
    })
   const checkbox =todoLI.querySelector("input");
    checkbox.addEventListener("change", ()=>{
       allTodos[todoIndex].completed = checkbox.checked;
       saveTodos();
    })
    checkbox.checked = todo.completed;

    console.log(deleteButton);
    return todoLI;

    function deleteTodoItem(todoIndex) {
      allTodos = allTodos.filter((_, i) => i !== todoIndex);
      saveTodos();
      updateTodoList();
    }
    //setting local storage
  }
  function saveTodos() {
    const todoJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todoJson);
  }
  // saveTodos()
  function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
  }

});
