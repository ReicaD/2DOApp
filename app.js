document.addEventListener("DOMContentLoaded", function () {
    const todoForm = document.querySelector("form");
    const todoInput = document.getElementById("todo-input");
    const todoListUL = document.getElementById("todo-list");
  
    let allTodos = [];
  
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
      const todoLI = document.createElement("li");
      todoLI.className ="todo";
      return todoLI;
    }
  });
  