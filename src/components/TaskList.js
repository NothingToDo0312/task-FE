import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import FilterBar from './FilterBar';
import taskService from '../services/taskService';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({
    category: '',
    priority: '',
    completed: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('dateCreated');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(`Failed to load tasks. Please check if the API is running. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.addTask(taskData);
      setTasks(prev => [...prev, newTask]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
        setEditingTask(null);
      } else {
        setError('Task not found');
      }
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const deletedTask = await taskService.deleteTask(id);
        if (deletedTask) {
          setTasks(prev => prev.filter(task => task.id !== id));
        } else {
          setError('Task not found');
        }
      } catch (err) {
        setError('Failed to delete task');
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleToggleComplete = async (id, isCompleted) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const updatedTask = { ...task, isCompleted };
      await handleUpdateTask(id, updatedTask);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesCategory = !filter.category || task.category === filter.category;
      const matchesPriority = !filter.priority || task.priority === filter.priority;
      const matchesCompleted = filter.completed === '' || 
        (filter.completed === 'true' && task.isCompleted) ||
        (filter.completed === 'false' && !task.isCompleted);
      const matchesSearch = !filter.search || 
        task.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        (task.category && task.category.toLowerCase().includes(filter.search.toLowerCase()));
      
      return matchesCategory && matchesPriority && matchesCompleted && matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'deadline':
          aValue = new Date(a.deadline);
          bValue = new Date(b.deadline);
          break;
        case 'dateCreated':
        default:
          aValue = new Date(a.dateCreated);
          bValue = new Date(b.dateCreated);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const categories = [...new Set(tasks.map(task => task.category).filter(Boolean))];
  const priorities = [...new Set(tasks.map(task => task.priority).filter(Boolean))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>Task Manager</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Task
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categories}
        priorities={priorities}
      />

      <div className="task-stats">
        <span>Total: {tasks.length}</span>
        <span>Completed: {tasks.filter(t => t.isCompleted).length}</span>
        <span>Pending: {tasks.filter(t => !t.isCompleted).length}</span>
      </div>

      <div className="task-list">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found. {filter.search || filter.category || filter.priority || filter.completed !== '' ? 'Try adjusting your filters.' : 'Add your first task!'}</p>
          </div>
        ) : (
          filteredAndSortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))
        )}
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={(taskData) => handleUpdateTask(editingTask.id, taskData)}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
