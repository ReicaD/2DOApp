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
    //to present user from submiting an empy todo
    if (todoText.length > 0) {
      allTodos.push(todoText);
      updateTodoList();
      todoInput.value = "";
    }
    // alert(todoText);
    //  console.log(allTodos);
  }
  //updating the submited value of the todo list
  function updateTodoList((todo, todoIndex)=>{
    todoListUL.innerHTML = "";
    allTodos.forEach(()=>{
    let todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
    })

  }
  function createTodoItem(todo) {
    const todoLI = document.createElement("li");
    todoLI.innerText = todo;
    // todoListUL.append(todoLI);
    return todoLI;
  }
});
