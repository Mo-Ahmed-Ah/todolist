let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const addButton = document.querySelector(".btn");
const deleteButton = document.querySelector(".deleteButton");
const toggleNightModeButton = document.querySelector(".toggleNightModeButton");
const todoCount = document.querySelector(".counter-container p span");

const sounds = {
  check: new Audio("./sounds/click-sound.mp3"),
  uncheck: new Audio("./sounds/uncheck-sound.mp3"),
  delete: new Audio("./sounds/delete-sound.mp3"),
  add: new Audio("./sounds/add-sound.mp3"),
};

document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTodo();
    }
  });
  deleteButton.addEventListener("click", deleteAllTodos);
  toggleNightModeButton.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    document.querySelector(".todo").classList.toggle("night-mode");
  });
  renderTodo();
});

const renderTodo = () => {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = item.completed ? "completed" : "";
    li.innerHTML = `
      <input type="checkbox" id="todo-${index}" ${
      item.completed ? "checked" : ""
    }>
      <label class="checkbox-label" for="todo-${index}">${item.text}</label>
      <span class="time-label">${item.time}</span>
    `;
    li.querySelector("input[type='checkbox']").addEventListener("change", () =>
      toggleComplete(index)
    );
    todoList.appendChild(li);
  });
  updateTodoCount();
};

const addTodo = () => {
  const text = todoInput.value.trim();
  if (text) {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    todo.push({ text, completed: false, time });
    localStorage.setItem("todo", JSON.stringify(todo));
    todoInput.value = "";
    renderTodo();
    playSound("add");
  }
};

const toggleComplete = (index) => {
  todo[index].completed = !todo[index].completed;
  localStorage.setItem("todo", JSON.stringify(todo));
  renderTodo();
  playSound(todo[index].completed ? "check" : "uncheck");
};

const deleteAllTodos = () => {
  todo = [];
  localStorage.setItem("todo", JSON.stringify(todo));
  renderTodo();
  playSound("delete");
};

const updateTodoCount = () => {
  todoCount.textContent = todo.length;
};

const playSound = (sound) => {
  if (sounds[sound]) {
    sounds[sound]
      .play()
      .catch((e) => console.error("Failed to play sound:", e));
  }
};
