import React, { useState, useEffect } from 'react';
import { 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Save 
} from 'lucide-react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now(), completed: false }]);
  };

  const editTask = (id, updatedTask) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">Todo List</h1>
      <TaskForm onAddTask={addTask} />
      <TaskList 
        tasks={tasks}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onToggleCompletion={toggleCompletion}
      />
    </div>
  );
};

const TaskForm = ({ onAddTask }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onAddTask({ name, description });
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input 
        type="text"
        placeholder="Task Name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="task-input"
      />
      <textarea 
        placeholder="Task Description" 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="task-textarea"
      />
      <button type="submit" className="task-submit-btn">
        Add Task
      </button>
    </form>
  );
};

const TaskList = ({ tasks, onEditTask, onDeleteTask, onToggleCompletion }) => {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
    </div>
  );
};

const TaskItem = ({ task, onEditTask, onDeleteTask, onToggleCompletion }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleEdit = () => {
    if (isEditing) {
      onEditTask(task.id, { name: editedName, description: editedDescription });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        {isEditing ? (
          <>
            <input 
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="task-edit-input"
            />
            <textarea 
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="task-edit-textarea"
            />
          </>
        ) : (
          <>
            <h3 className="task-name">{task.name}</h3>
            <p className="task-description">{task.description}</p>
          </>
        )}
      </div>
      <div className="task-actions">
        <button 
          onClick={() => onToggleCompletion(task.id)} 
          className="task-complete-btn"
        >
          {task.completed ? <X /> : <Check />}
        </button>
        <button 
          onClick={handleEdit} 
          className="task-edit-btn"
        >
          {isEditing ? <Save /> : <Pencil />}
        </button>
        <button 
          onClick={() => onDeleteTask(task.id)} 
          className="task-delete-btn"
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
};

export default App;