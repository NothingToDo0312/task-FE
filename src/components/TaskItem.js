import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-none';
    }
  };

  const getCategoryClass = (category) => {
    if (!category) return 'category-none';
    return `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const isOverdue = () => {
    if (task.isCompleted) return false;
    return new Date(task.deadline) < new Date();
  };

  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''}`}>
      <div className="task-main">
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={(e) => onToggleComplete(task.id, e.target.checked)}
            aria-label={`Mark task as ${task.isCompleted ? 'incomplete' : 'complete'}`}
          />
        </div>
        
        <div className="task-content">
          <div className="task-header">
            <h3 className="task-name">{task.name}</h3>
            <div className="task-badges">
              {task.category && (
                <span className={`badge category-badge ${getCategoryClass(task.category)}`}>
                  {task.category}
                </span>
              )}
              {task.priority && (
                <span className={`badge priority-badge ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
              )}
            </div>
          </div>
          
          <div className="task-dates">
            <div className="task-date">
              <span className="date-label">Created:</span>
              <span className="date-value">{formatDateTime(task.dateCreated)}</span>
            </div>
            {task.dateUpdated !== task.dateCreated && (
              <div className="task-date">
                <span className="date-label">Updated:</span>
                <span className="date-value">{formatDateTime(task.dateUpdated)}</span>
              </div>
            )}
            <div className="task-date">
              <span className="date-label">Deadline:</span>
              <span className={`date-value ${isOverdue() ? 'overdue' : ''}`}>
                {formatDate(task.deadline)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="task-actions">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          ✏️
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
