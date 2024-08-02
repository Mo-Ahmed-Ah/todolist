let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const addButton = document.querySelector(".btn");
const deleteButton = document.querySelector(".deleteButton");
const todoCount = document.querySelector(".counter-container p span");

const sounds = {
  check: new Audio("../sounds/click-sound.mp3"),
  uncheck: new Audio("../sounds/uncheck-sound.mp3"),
  delete: new Audio("../sounds/delete-sound.mp3"),
  add: new Audio("../sounds/add-sound.mp3"),
};

document.addEventListener("DOMContentLoaded", function () {
  // Load audio files after user interaction
  document.body.addEventListener("click", () => {
    for (let sound in sounds) {
      sounds[sound].preload = "auto";
    }
  });

  if (addButton) {
    addButton.addEventListener("click", addTask);
  }
  if (todoInput) {
    todoInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        addTask();
      }
    });
  }
  if (deleteButton) {
    deleteButton.addEventListener("click", deleteAllTasks);
  }
  displayTasks();
  cleanOldTasks(); // تنظيف المهام القديمة عند تحميل الصفحة
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString(), // سجل وقت إنشاء المهمة
    });
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
    sounds.add.play(); // تشغيل الصوت عند إضافة المهمة
  }
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((task, index) => {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");

    checkbox.type = "checkbox";
    checkbox.id = `task-${index}`;
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        sounds.check.play(); // تشغيل الصوت عند تحديد المهمة
      } else {
        sounds.uncheck.play(); // تشغيل الصوت عند إلغاء التحديد
      }
      toggleTask(index);
    });

    label.htmlFor = `task-${index}`;
    label.classList.add("checkbox-label");
    label.textContent = task.text;

    listItem.appendChild(checkbox);
    listItem.appendChild(label);

    if (task.completed) {
      listItem.classList.add("completed");
    }

    todoList.appendChild(listItem);
  });
  todoCount.textContent = todo.length;
}

function toggleTask(index) {
  todo[index].completed = !todo[index].completed;
  if (todo[index].completed) {
    todo[index].createdAt = new Date().toISOString(); // سجل وقت إتمام المهمة
  }
  saveToLocalStorage();
  displayTasks();
  cleanOldTasks(); // تنظيف المهام القديمة بعد التحديث
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

function cleanOldTasks() {
  const now = new Date();
  const tasksToKeep = [];

  todo.forEach((task, index) => {
    if (task.completed) {
      const createdAt = new Date(task.createdAt);
      const timeElapsed = now - createdAt;
      const timeLeft = 1 * 60 * 1 - timeElapsed; // 1 دقيقة

      if (timeLeft <= 0) {
        // إضافة تأثير التلاشي قبل حذف العنصر
        const listItem = document.querySelector(`#task-${index}`).closest("li");
        if (listItem) {
          sounds.delete.play(); // تشغيل صوت الحذف
          listItem.style.opacity = "0";
          listItem.style.transition = "opacity 0.5s ease";
          setTimeout(() => {
            listItem.remove();
            // حذف العنصر من المصفوفة
            todo.splice(index, 1);
            saveToLocalStorage();
            displayTasks();
          }, 500); // مدة التلاشي
          return; // تجنب إضافة العنصر المحذوف إلى `tasksToKeep`
        }
      } else {
        tasksToKeep.push(task);
      }
    } else {
      tasksToKeep.push(task);
    }
  });

  // تحديث المصفوفة والحفظ
  todo = tasksToKeep;
  saveToLocalStorage();
  displayTasks();
}
