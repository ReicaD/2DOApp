document.addEventListener("DOMContentLoaded", async function () {
  const todoForm = document.querySelector("form");
  const todoInput = document.getElementById("todo-input");
  const todoListUL = document.getElementById("todo-list");

  // Auth Check
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  let allTodos = [];
  
  // Initialize from Supabase
  await loadAndDisplayTodos();


  todoForm.addEventListener("submit", async function (e) {
    e.preventDefault(); 
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
      const newTodo = await addTodoToSupabase(todoText);
      if (newTodo) {
        todoInput.value = "";
        await loadAndDisplayTodos();
      }
    }
  });

  async function loadAndDisplayTodos() {
    allTodos = await getTodosFromSupabase();
    todoListUL.innerHTML = "";
    allTodos.forEach((todo) => {
      let todoItem = createTodoItem(todo); 
      todoListUL.append(todoItem);
    });
  }

  function createTodoItem(todo) {
    const todoId = "todo-" + todo.id;
    const todoLI = document.createElement("li");
    todoLI.className = "todo border-b border-base-200 last:border-none py-2";
    todoLI.innerHTML = `
      <div class="flex items-center justify-between w-full p-2 hover:bg-base-200 rounded-lg transition-colors group">
          <div class="flex items-center gap-4 flex-grow">
              <input type="checkbox" id="${todoId}" class="checkbox checkbox-accent checkbox-md" ${todo.completed ? 'checked' : ''} />
              <label for="${todoId}" class="todo-text text-lg cursor-pointer ${todo.completed ? 'line-through text-base-content/50' : 'text-base-content'}">
                ${todo.text}
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
    deleteButton.addEventListener("click", async () => {
      await deleteTodoFromSupabase(todo.id);
      await loadAndDisplayTodos();
    });

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", async () => {
       await updateTodoInSupabase(todo.id, checkbox.checked);
       const label = todoLI.querySelector(".todo-text");
       if (checkbox.checked) {
           label.classList.add('line-through', 'text-base-content/50');
       } else {
           label.classList.remove('line-through', 'text-base-content/50');
       }
    });

    return todoLI;
  }
});

