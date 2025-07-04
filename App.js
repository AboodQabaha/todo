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
const handleDeleteAction = (actionType) => {
  switch (actionType) {
    case "DeleteDone":
      deleteActionH2.textContent = "Delete Done Tasks";
      deleteActionP.textContent =
        "Are you sure you want to delete completed tasks?";
      todosArray = todosArray.filter((todo) => !todo.isDone);
      break;
    case "DeleteAll":
      deleteActionH2.textContent = "Delete All Tasks";
      deleteActionP.textContent = "Are you sure you want to delete all tasks?";
      todosArray = [];
      break;
    default:
      console.error("Action does not exist :(");
      return;
  }
   setLocalStorage("todos_array", todosArray);
  showData(todosArray);
  deleteActionAlert.classList.remove("active");
};
deleteActions.forEach((action) => {
  action.addEventListener("click", () => {
    const deleteType = action.getAttribute("data-deleteType");
    deleteActionAlert.classList.add("active");
    confirmBtn.onclick = () => handleDeleteAction(deleteType);
    cancelBtn.onclick = () => deleteActionAlert.classList.remove("active");
  });
});
showData(todosArray);
// تعديل المهمة
const renameTaskFun = (index) => {
  const renameTask = document.querySelector(".renameTask");
  const newTaskInput = renameTask.querySelector(".newTaskInput");
  const RenamTaskErrorsContainer = renameTask.querySelector("#violations");
  const saveBtn = renameTask.querySelector(".saveBtn");
  const cancelBtn = renameTask.querySelector(".cancelBtn");
  RenamTaskErrorsContainer.textContent = "";

  const TargetTask = todosArray[index];
  newTaskInput.value = TargetTask.description;
  renameTask.classList.add("active");

  cancelBtn.onclick = () => {
    renameTask.classList.remove("active");
  };

  saveBtn.onclick = () => {
    let error = validateTodo(newTaskInput.value);
    if (error) {
      RenamTaskErrorsContainer.textContent = error;
    } else {
      RenamTaskErrorsContainer.textContent = "";
      TargetTask.description = newTaskInput.value;
      todosArray[index] = TargetTask;
      showData(todosArray);
      renameTask.classList.remove("active");
      setLocalStorage("todos_array", todosArray);
    }
  };
};


const removeTask = (targetIndex) => {
  const deleteAction = document.querySelector(".deleteAction");
  const deleteActionH2 = deleteAction.querySelector("h2");
  const deleteActionP = deleteAction.querySelector("p");
  const confirmBtn = deleteAction.querySelector(".confirm");
  const cancelBtn = deleteAction.querySelector(".cancel");

  deleteActionH2.textContent = "Delete Task";
  deleteActionP.textContent = "are you sure you want to delete this task";
  deleteAction.classList.add("active");

  confirmBtn.onclick = () => {
    todosArray = todosArray.filter((_, index) => index !== targetIndex);
    showData(todosArray);
    setLocalStorage("todos_array", todosArray);
    deleteAction.classList.remove("active");
  };

  cancelBtn.onclick = () => {
    deleteAction.classList.remove("active");
  };
};
