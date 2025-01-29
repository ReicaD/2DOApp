document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.querySelector('form');
    const todoInput = document.getElementById('todo-input');
    const todoListUL = document.getElementById('todo-list');

    let allTodos = [];
    // This is for the submit event
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission
        addTodo(); 
    });

    function addTodo(){
        const todoText = todoInput.value.trim(); 
        allTodos.push(todoText)
        alert(todoText);
        // console.log(allTodos);
    }
})






















// const todoForm= document.querySelector('form');
// const todoInput = document.getElementById('todo-input')
// const todoListUL = document.getElementById('todo-list')

// let allTodos =[];
// // this is for the submit to be excuted by also adding the call back
// todoForm.addEventListener('submit', function(e){
//     alert("test");
// })
