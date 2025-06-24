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