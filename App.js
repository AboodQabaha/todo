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
    descriptionInput.value = "";
    setLocalStorage("todos_array", todosArray);
  }
};