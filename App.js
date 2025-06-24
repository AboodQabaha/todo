const setLocalStorage = (key, value) => {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    return JSON.parse(localStorage.getItem(key)) || [];
  }
};
let todosArray = setLocalStorage("todos_array", null);

let descriptionInput = document.getElementById("todoField");
let createNewTodoBtn = document.getElementById("createNewTodo");
let errorsContainer = document.querySelector("#violations");

const validateTodo = (todo) => {
  let regex = /^[0-9]/;
  if (todo === "") {
    return "The todo cannot be empty!";
  } else if (regex.test(todo)) {
    return "Numbers are not allowed in the description field.";
  } else if (todo.length < 5) {
    return "The description must not be less than 5 characters.";
  }
  return null;
};

descriptionInput.oninput = () => {
  let value = descriptionInput.value.trim();
  let error = validateTodo(value);
  if (error) {
    errorsContainer.textContent = error;
  } else {
    errorsContainer.textContent = "";
  }
};
createNewTodoBtn.onclick = () => {
  const newTodo = {
    description: descriptionInput.value.trim(),
    isDone: false,
  };
  let error = validateTodo(newTodo.description);
  if (!error) {
    todosArray.push(newTodo);
     showData(todosArray);
    descriptionInput.value = "";
    setLocalStorage("todos_array", todosArray);
  }
};
const showData = (todos) => {
  const deleteActions = document.querySelectorAll(
    ".todoList .container .DeleteActions li"
  );
  deleteActions.forEach((action) => {
    if (todosArray.length > 0) {
      action.classList.remove("disabled");
    } else {
      action.classList.add("disabled");
    }
  });

  const TasksContainer = document.querySelector("#Tasks");
  TasksContainer.innerHTML = "";
  todos.forEach((todo, index) => {
    let Task = `
      <div class="task ${todo.isDone ? "done" : ""}">
        <p class="description">${todo.description}</p>
        <div class="actions">
          <input  type="checkbox" ${
            todo.isDone ? "checked" : ""
          } onchange="setDone(${index})">
          <i class="fa-solid fa-pencil edit" onclick="renameTaskFun(${index})"></i>
          <i class="fa-solid fa-trash remove" onclick="removeTask(${index})"></i>
        </div>
      </div>
    `;
    TasksContainer.insertAdjacentHTML("beforeend", Task);
  });
};
const setDone = (index) => {
  let categories = document.querySelectorAll(
    ".todoList .container .pagination li"
  );
  categories.forEach((cat) => cat.classList.remove("active"));
  categories[0].classList.add("active"); // All
  todosArray[index].isDone = !todosArray[index].isDone;
  showData(todosArray);
  setLocalStorage("todos_array", todosArray);
};
let categories = document.querySelectorAll(
  ".todoList .container .pagination li"
);
categories.forEach((cat) => {
  cat.onclick = () => {
    categories.forEach((c) => c.classList.remove("active"));
    cat.classList.add("active");
    const category = cat.getAttribute("data-category");
    switch (category) {
      case "all":
        showData(todosArray);
        break;
      case "done":
        showData(todosArray.filter((todo) => todo.isDone));
        break;
      case "todo":
        showData(todosArray.filter((todo) => !todo.isDone));
        break;
      default:
        alert("category not found");
    }
  };
});
const deleteActions = document.querySelectorAll(
  ".todoList .container .DeleteActions li"
);
const deleteActionAlert = document.querySelector(".deleteAction");
const deleteActionH2 = deleteActionAlert.querySelector("h2");
const deleteActionP = deleteActionAlert.querySelector("p");
const confirmBtn = deleteActionAlert.querySelector(".confirm");
const cancelBtn = deleteActionAlert.querySelector(".cancel");
