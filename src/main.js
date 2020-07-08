(function (window, document) {
  const todoListDOM = document.getElementById("todoList");
  const todoInputDom = document.getElementById("todoInput");

  const url = "http://localhost:3000/todolist";
  let todoList = [];

  // Post todo
  todoInputDom.addEventListener("keydown", (evt) => {
    if (evt.keyCode === 13 && evt.target.value) {
      todoAddHandler(evt.target.value);
      evt.target.value = "";
    }
  });

  // Edit todo
  todoListDOM.addEventListener("click", (evt) => {
    const target = evt.target;
    if (target && target.classList.contains("checkbox")) {
      todoEditHandler(target.dataset.id);
    }
    if (target && target.classList.contains("del")) {
      todoDeleteHandler(target.dataset.id);
    }
  });

  // Read todo
  axios
    .get(url)
    .then((res) => {
      todoList = todoList.concat(res.data);
      todoRenderHandler(todoList);
    })
    .catch((err) => {
      console.log(err);
    });

  function todoRenderHandler(todoList) {
    const html = todoList
      .map(
        (item, index) =>
          `
        <li class="list">
          <a class="checkbox ${
            item.isComplete ? "finish" : "unfinish"
          }" data-id=${item.id}>
          </a>
          <p class="desc" data-id=${item.id}>
            ${item.desc}
          </p>
          <a class="del" data-id=${item.id}></a>
        <li>
      `
      )
      .join("");

    todoListDOM.innerHTML = html;
  }

  function todoAddHandler(value) {
    const newItem = { desc: value, isComplete: false };

    axios.post(url, newItem).then((res) => {
      todoList.push(res.data);
      todoRenderHandler(todoList);
    });
  }

  function todoEditHandler(id) {
    const todo = todoList.find((item) => item.id === id);
    todo.isComplete = !todo.isComplete;

    axios.put(url + "/" + id, todo).then(() => {
      todoRenderHandler(todoList);
    });
  }

  function todoDeleteHandler(id) {
    axios.delete(url + "/" + id).then(() => {
      todoList = todoList.filter((item) => item.id !== id);
      todoRenderHandler(todoList);
    });
  }
})(window, document);
