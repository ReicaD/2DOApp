document.addEventListener("DOMContentLoaded", function () {
    const todoForm = document.querySelector("form");
    const todoInput = document.getElementById("todo-input");
    const todoListUL = document.getElementById("todo-list");
  
    let allTodos = getTodos();
    //to get to dodo back on the page
        updateTodoList()
  
    // This is for the submit event
    todoForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission
      addTodo();
    });
  
    function addTodo() {
      const todoText = todoInput.value.trim();
      // Prevent user from submitting an empty todo
      if (todoText.length > 0) {
        allTodos.push(todoText);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
      }
    }
  
    // Updating the submitted value of the todo list
    function updateTodoList() {
      todoListUL.innerHTML = "";
      allTodos.forEach((todo, todoIndex) => {
        let todoItem = createTodoItem(todo, todoIndex); // Pass both parameters
        todoListUL.append(todoItem);
      });
    }
  
    function createTodoItem(todo, todoIndex) {
       const todoId = "todo-" +todoIndex;
      const todoLI = document.createElement("li");
      todoLI.className ="todo";
      todoLI.innerHTML = `
      <!-- checking the to do and save -->
          <input type="checkbox" id="${todoId}" >
          <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            > 
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
          </label>
          <label for="${todoId}" class="todo-text">
           ${todo}
          </label>
          <button class="delete-button">
            <svg fill="var(--secondary)"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            > 
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
              />
            </svg>
          </button>
      
      `
       const deleteButton = todoLI.querySelector("delete-button");
       //this deletes the todo Button
        deleteButton.addEventListener("click", ()=>{
            deleteTodoItem(todoIndex);
        })

      return todoLI;

      
      function deleteTodoItem(todoIndex){
          allTodos = allTodos.filter((_, i)=> i !== todoIndex);
          saveTodos();
          updateTodoList();
      }
      //setting local storage
    } function saveTodos(){
        const todoJson = JSON.stringify(allTodos)
        localStorage.setItem("todos", todoJson)
    }
    // saveTodos()
  function getTodos(){
      const todos = localStorage.getItem("todos") || "[]";
      return JSON.parse(todos);
  }

  });
  