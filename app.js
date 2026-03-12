document.addEventListener("DOMContentLoaded", async function () {
  const todoForm = document.querySelector("form");
  const todoInput = document.getElementById("todo-input");
  const todoListUL = document.getElementById("todo-list");
  const welcomeMsg = document.getElementById("welcome-msg");

  // Auth Check
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Update Welcome Message
  if (user && user.email) {
    welcomeMsg.innerHTML = `Welcome back, <span class="text-[#ebd740] font-bold">${user.email.split('@')[0]}</span>. Your life is waiting.`;
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
    
    todoLI.className = "flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#ebd740]/30 transition-all group animate-in slide-in-from-bottom-2 duration-300";
    
    todoLI.innerHTML = `
      <div class="flex items-center gap-4 flex-grow">
          <input type="checkbox" id="${todoId}" class="checkbox checkbox-accent checkbox-md border-2 border-white/20" ${todo.completed ? 'checked' : ''} />
          <label for="${todoId}" class="todo-text text-xl font-medium cursor-pointer transition-all ${todo.completed ? 'line-through text-white/30 italic' : 'text-white'}">
            ${todo.text}
          </label>
      </div>
      <button class="delete-button btn btn-ghost btn-circle btn-sm text-error opacity-0 group-hover:opacity-100 transition-all hover:bg-error/10">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"> 
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </button>
    `;

    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", async () => {
      todoLI.classList.add('opacity-0', 'scale-95');
      setTimeout(async () => {
        await deleteTodoFromSupabase(todo.id);
        await loadAndDisplayTodos();
      }, 200);
    });

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", async () => {
       await updateTodoInSupabase(todo.id, checkbox.checked);
       const label = todoLI.querySelector(".todo-text");
       if (checkbox.checked) {
           label.classList.add('line-through', 'text-white/30', 'italic');
           label.classList.remove('text-white');
       } else {
           label.classList.remove('line-through', 'text-white/30', 'italic');
           label.classList.add('text-white');
       }
    });

    return todoLI;
  }
});

