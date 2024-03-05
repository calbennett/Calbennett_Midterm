let titleInput = document.getElementById('title');
let clsInput = document.getElementById('cls');
let todoId = document.getElementById('todo-id');
let titleEditInput = document.getElementById('title-edit');
let clsEditInput = document.getElementById('cls-edit');
let dueInput = document.getElementById('due');
let dueEditInput = document.getElementById('due-edit');
let priorityInput = document.getElementById('priority');
let priorityEditInput = document.getElementById('priority-edit');
let todos = document.getElementById('todos');
let data = [];
let selectedTodo = {};
const api = 'http://localhost:5173';

function tryAdd() {
  let msg = document.getElementById('msg');
  msg.innerHTML = '';
}

document.getElementById('form-add').addEventListener('submit', (e) => {
  e.preventDefault();

  if (!titleInput.value) {
    document.getElementById('msg').innerHTML = 'Name cannot be blank';
  } else {
    addTodo({
      title: titleInput.value,
      cls: clsInput.value,
      due: dueInput.value,
      priority: priorityInput.value
    });
  }
});

let addTodo = ({ title, cls, due, priority }) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 201) {
      const newTodo = JSON.parse(xhr.responseText);
      data.push(newTodo);
      console.log(newTodo.id, title, cls, due, priority);
      refreshTodos();
    } else {
      console.error('Error adding task');
    }
  };

  xhr.open('POST', `${api}/todos`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, cls, due, priority }));
};

let refreshTodos = () => {
  todos.innerHTML = '';
  console.log(data);
  data
  .sort((a, b) => b.id.localeCompare(a.id))
    .map((x) => {
      return (todos.innerHTML += `
        <div id="todo-${x.id}">
          <span class="fw-bold fs-4">${x.title}</span>
          <pre class="text-secondary ps-3">${x.cls}</pre>
          <pre due="text-secondary ps-3">Due ${x.due}</pre>
          <pre priority="text-secondary ps-3>Priority: ${x.priority}</pre>

  
          <span class="options">
            <i onClick="tryEditTodo(${x.id})" data-bs-toggle="modal" data-bs-target="#modal-edit" class="fas fa-edit"></i>
            <i onClick="deleteTodo(${x.id})" class="fas fa-trash-alt"></i>
          </span>
        </div>
    `);
    });

  resetForm();
};
let tryEditTodo = (id) => {
  const todo = data.find((x) => x.id === id);
  selectedTodo = todo;
  todoId.innerText = todo.id;
  titleEditInput.value = todo.title;
  clsEditInput.value = todo.cls;
  priorityEditInput.value = todo.priority;
  document.getElementById('msg').innerHTML = '';
  console.log('Todo with id ', id, ' updated')
};

document.getElementById('form-edit').addEventListener('submit', (e) => {
  e.preventDefault();

  if (!titleEditInput.value) {
    msg.innerHTML = 'Todo cannot be blank';
  } else {
    editTodo(titleEditInput.value, clsEditInput.value, dueEditInput.value, priorityEditInput.value);

    // close modal
    let edit = document.getElementById('edit');
    edit.setAttribute('data-bs-dismiss', 'modal');
    edit.click();
    (() => {
      edit.setAttribute('data-bs-dismiss', '');
    })();
  }
});
let editTodo = (title, cls, due, priority) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      selectedTodo.title = title;
      selectedTodo.cls = cls;
      selectedTodo.due = due;
      selectedTodo.priority = priority;
      refreshTodos();
    }
  };
  xhr.open('PUT', `${api}/todos/${selectedTodo.id}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, cls }));
};

let deleteTodo = (id) => {
  console.log("Attempting to delete todo")
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    console.log(`XHR ReadyState: ${xhr.readyState}, Status: ${xhr.status}`);
    if (xhr.readyState == 4) {
      console.log(`Response Text: ${xhr.responseText}`);
      if (xhr.status == 200) {
        data = data.filter((x) => x.id !== id);
        refreshTodos();
      }
    }
  };
  xhr.open('DELETE', `${api}/todos/${id}`, true);
  xhr.send();
};

let resetForm = () => {
  titleInput.value = '';
  clsInput.value = '';
  dueInput.value = ''
};

let getTodos = () => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText) || [];
      refreshTodos();
    }
  };
  xhr.open('GET', `${api}/todos`, true);
  xhr.send();
};

(() => {
  getTodos();
})();
