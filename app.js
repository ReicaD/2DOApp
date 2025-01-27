document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.querySelector('form');
    const todoInput = document.getElementById('todo-input');
    const todoListUL = document.getElementById('todo-list');

    let allTodos = [];
    // This is for the submit event
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission
        alert("test");
    });
});






















 