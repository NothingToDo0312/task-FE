import React from 'react';
import './FilterBar.css';

const FilterBar = ({ 
  filter, 
  setFilter, 
  sortBy, 
  setSortBy, 
  sortOrder, 
  setSortOrder, 
  categories, 
  priorities 
}) => {
  const handleFilterChange = (key, value) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilter({
      category: '',
      priority: '',
      completed: '',
      search: ''
    });
  };

  const hasActiveFilters = filter.category || filter.priority || filter.completed !== '' || filter.search;

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            value={filter.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search tasks..."
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={filter.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="completed">Status</label>
          <select
            id="completed"
            value={filter.completed}
            onChange={(e) => handleFilterChange('completed', e.target.value)}
            className="filter-select"
          >
            <option value="">All Tasks</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>
      </div>

      <div className="sort-section">
        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="dateCreated">Date Created</option>
            <option value="deadline">Deadline</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortOrder">Order</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button 
            className="btn btn-sm btn-secondary clear-filters"
            onClick={clearFilters}
            title="Clear all filters"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
