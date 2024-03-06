let titleInput = document.getElementById('title');
let clsInput = document.getElementById('cls');
let todoId = document.getElementById('todo-id');
let dueInput = document.getElementById('due');
let priorityInput = document.getElementById('priority');
let titleEditInput, clsEditInput, dueEditInput, priorityEditInput; // Declare these variables here

let todos = document.getElementById('todos');
let data = [];
let selectedTodo = {};
const api = 'http://127.0.0.1:5173';

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

document.addEventListener('DOMContentLoaded', () => {
  // Initialize these variables inside the event listener
  titleEditInput = document.getElementById('title-edit');
  clsEditInput = document.getElementById('cls-edit');
  dueEditInput = document.getElementById('due-edit');
  priorityEditInput = document.getElementById('priority-edit');

  document.getElementById('form-edit').addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = document.getElementById('msg');

    if (!titleEditInput.value) {
      msg.innerHTML = 'Todo cannot be blank';
    } else {
      editTodo({
        title: titleEditInput.value,
        cls: clsEditInput.value,
        due: dueEditInput.value,
        priority: priorityEditInput.value
      });

      let edit = document.getElementById('edit');
      edit.setAttribute('data-bs-dismiss', 'modal');
      edit.click();
    }
  })});


let addTodo = ({ title, cls, due, priority }) => {
  const xhr = new XMLHttpRequest();
  fetch(`${api}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, cls, due, priority }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(newTodo => {
    data.push(newTodo);
    console.log(newTodo.id, title, cls, due, priority);
    refreshTodos();
  })
  .catch(error => console.error('Error adding task', error));

  xhr.open('POST', `${api}/todos`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, cls, due, priority }));
};

let refreshTodos = () => {
  todos.innerHTML = '';
  console.log(data);
  data
  .sort((a, b) => b.id - a.id)
    .map((x) => {
      return (todos.innerHTML += `
        <div id="todo-${x.id}">
          <span class="fw-bold fs-4">${x.title}</span>
          <pre class="text-secondary ps-3">${x.cls}</pre>
          <pre class="text-secondary ps-3">Due ${x.due}</pre>
          <pre class="text-secondary ps-3">Priority: ${x.priority}</pre>

  
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
  dueEditInput.value = todo.due;
  priorityEditInput.value = todo.priority;
  document.getElementById('msg').innerHTML = '';
  console.log('Todo with id ', id, todo.title, todo.cls, todo.due, todo.priority, ' updated')
};

document.getElementById('form-edit').addEventListener('submit', (e) => {
  e.preventDefault();

  const titleEditInput = document.getElementById('titleEditInput');
  const clsEditInput = document.getElementById('clsEditInput');
  const dueEditInput = document.getElementById('dueEditInput');
  const priorityEditInput = document.getElementById('priorityEditInput');
  const msg = document.getElementById('msg');

  if (!titleEditInput.value) {
    msg.innerHTML = 'Todo cannot be blank';
  } 
  else {
    editTodo({
      title: titleEditInput.value,
      cls: clsEditInput.value,
      due: dueEditInput.value,
      priority: priorityEditInput.value
    });
    
    let edit = document.getElementById('edit');
    edit.setAttribute('data-bs-dismiss', 'modal');
    edit.click();
  }
  });
let editTodo = ({title, cls, due, priority}) => {
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
  console.log('Attempting to edit');
  xhr.open('PUT', `${api}/todos/${selectedTodo.id}`, true);
  console.log('Attempting to edit2');
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  console.log('Attempting to edit3');
  xhr.send(JSON.stringify({ title, cls, due, priority }));
  console.log('Attempting to edit4');
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
