document.addEventListener("DOMContentLoaded", async function () {
  const todoForm = document.querySelector("form");
  const todoInput = document.getElementById("todo-input");
  const todoListUL = document.getElementById("todo-list");
  const welcomeMsg = document.getElementById("welcome-msg");
  const authLinks = document.getElementById("auth-links");

  let currentUser = await getCurrentUser();
  let allTodos = [];

  // Update Navbar and Welcome Message
  if (currentUser) {
    if (welcomeMsg) welcomeMsg.innerHTML = `Welcome back, <span class="text-[#ebd740] font-bold">${currentUser.email.split('@')[0]}</span>. Your 2doApp is ready.`;

    if (authLinks) authLinks.innerHTML = `
      <li><a href="index.html" class="active">Home</a></li>
      <li><a href="blog.html">The Guide</a></li>
      <li><button onclick="signOutUser().then(() => window.location.reload())" class="btn btn-ghost btn-sm mt-1">Logout</button></li>
    `;
  } else {
    if (welcomeMsg) welcomeMsg.innerHTML = `Organizing your world, <span class="text-[#ebd740] font-bold">Guest</span>. <a href="login.html" class="link link-accent font-bold">Sign in</a> to save to the cloud.`;
    if (authLinks) authLinks.innerHTML = `
      <li><a href="index.html" class="active">Home</a></li>
      <li><a href="blog.html">The Guide</a></li>
      <li><a href="login.html" class="btn btn-ghost btn-sm mt-1">Log In</a></li>
      <li><a href="login.html" class="btn btn-accent btn-sm mt-1 text-[#0e1237] font-bold">Get Started</a></li>

    `;
  }

  // Initialize display
  await loadAndDisplayTodos();

  todoForm.addEventListener("submit", async function (e) {
    e.preventDefault(); 
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
      if (currentUser) {
        await addTodoToSupabase(todoText);
      } else {
        const guestTodos = JSON.parse(localStorage.getItem('guest_todos') || '[]');
        guestTodos.push({ id: Date.now(), text: todoText, completed: false });
        localStorage.setItem('guest_todos', JSON.stringify(guestTodos));
      }
      todoInput.value = "";
      await loadAndDisplayTodos();
    }
  });

  async function loadAndDisplayTodos() {
    if (currentUser) {
      allTodos = await getTodosFromSupabase();
    } else {
      allTodos = JSON.parse(localStorage.getItem('guest_todos') || '[]');
    }
    
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
        if (currentUser) {
          await deleteTodoFromSupabase(todo.id);
        } else {
          let guestTodos = JSON.parse(localStorage.getItem('guest_todos') || '[]');
          guestTodos = guestTodos.filter(t => t.id !== todo.id);
          localStorage.setItem('guest_todos', JSON.stringify(guestTodos));
        }
        await loadAndDisplayTodos();
      }, 200);
    });

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", async () => {
       if (currentUser) {
         await updateTodoInSupabase(todo.id, checkbox.checked);
       } else {
         let guestTodos = JSON.parse(localStorage.getItem('guest_todos') || '[]');
         const target = guestTodos.find(t => t.id === todo.id);
         if (target) target.completed = checkbox.checked;
         localStorage.setItem('guest_todos', JSON.stringify(guestTodos));
       }
       
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


