document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');
  const errorMessages = document.getElementById('errorMessages');
  const apiUrl = 'http://localhost:3000/tasks';

  async function fetchTasks() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await response.json();
      renderTaskList(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      
    }
  }

// add tsk section need for imporvement 

  async function addTask(task) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
  
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
  
      const newTask = await response.json();
      fetchTasks(); // Refresh task list after adding task
    } catch (error) {
      console.error('Error adding task:', error);
     
    }
  }

  //update tasks 
  
  async function updateTask(id, task) {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (response.status === 200) {
      fetchTasks();
    } else {
      const errorData = await response.json();
      displayErrors(errorData.errors);
    }
  }

  async function deleteTask(id) {
    await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    });
    fetchTasks();
  }

  function renderTaskList(tasks) {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
      const taskItem = document.createElement('li');
      taskItem.classList.add('list-group-item', 'task-item');
      taskItem.innerHTML = `
        <div>
          <h5>${task.title}</h5>
          <p>${task.description}</p>
          <p>Due: ${task.dueDate}</p>
          <button class="btn btn-info btn-sm" onclick="viewTask(${task.id})">View</button>
          <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      `;
      taskList.appendChild(taskItem);
    });
  }

  function displayErrors(errors) {
    errorMessages.innerHTML = errors.map(err => `<p>${err.msg}</p>`).join('');
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      dueDate: document.getElementById('dueDate').value
    };
    addTask(newTask);
    taskForm.reset();
  });

  window.viewTask = async function(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const task = await response.json();
    alert(`Title: ${task.title}\nDescription: ${task.description}\nDue Date: ${task.dueDate}`);
  };

  window.editTask = async function(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const task = await response.json();
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('dueDate').value = task.dueDate;
    taskForm.onsubmit = (e) => {
      e.preventDefault();
      const updatedTask = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        dueDate: document.getElementById('dueDate').value
      };
      updateTask(id, updatedTask);
      taskForm.reset();
      taskForm.onsubmit = taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
          title: document.getElementById('title').value,
          description: document.getElementById('description').value,
          dueDate: document.getElementById('dueDate').value
        };
        addTask(newTask);
        taskForm.reset();
      });
    };
  };

  window.deleteTask = function(id) {
    deleteTask(id);
  };

  fetchTasks();
});
