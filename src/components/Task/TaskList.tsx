import React, { useState, useMemo, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useTaskContext } from "./TaskProvider";
import { TaskStatus } from "../../types/Task/types";
import TaskFilter, { type FilterKey } from "../../components/Task/TaskFilter";
import TaskStatusLegend from "./TaskStatusLegend";
import { useTheme } from "../../context/ThemeContext";

const TaskList: React.FC = () => {
  const { tasks, setTasks } = useTaskContext();
  const { darkMode } = useTheme();

  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    title: "",
    desc: "",
    both: "",
    status: "",
  });

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: FilterKey
  ) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const filteredTasks = useMemo(() => {
    const safeTasks = tasks ?? [];

    return safeTasks.filter((task) => {
      const titleMatch = filters.title
        ? task.title.toLowerCase().includes(filters.title.toLowerCase())
        : true;
      const descMatch = filters.desc
        ? task.desc.toLowerCase().includes(filters.desc.toLowerCase())
        : true;
      const bothMatch = filters.both
        ? task.title.toLowerCase().includes(filters.both.toLowerCase()) ||
          task.desc.toLowerCase().includes(filters.both.toLowerCase())
        : true;
      const statusMatch = filters.status
        ? task.status === (filters.status as TaskStatus)
        : true;
      return titleMatch && descMatch && bothMatch && statusMatch;
    });
  }, [tasks, filters]);

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return "bg-danger bg-opacity-25 border border-danger";
      case TaskStatus.IN_PROGRESS:
        return "bg-warning bg-opacity-25 border border-warning";
      case TaskStatus.DONE:
        return "bg-success bg-opacity-25 border border-success";
      default:
        return "";
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setTasks((prev) => (prev ? prev.filter((task) => task.id !== id) : []));
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev
        ? prev.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        : []
    );
  };

  const getNoTasksMessage = () => {
    if (filters.title && filteredTasks.length === 0) {
      return `No tasks found for title: "${filters.title}"`;
    }
    if (filters.desc && filteredTasks.length === 0) {
      return `No tasks found for description: "${filters.desc}"`;
    }
    if (filters.both && filteredTasks.length === 0) {
      return `No tasks found for both title and description: "${filters.both}"`;
    }
    if (filters.status && filteredTasks.length === 0) {
      return `No tasks found for status: "${filters.status}"`;
    }
    return "No tasks found.";
  };

  return (
    <div className={`container mt-5 ${darkMode ? "bg-dark text-white" : ""}`}>
      <h2 className="mb-4 text-center">Task List</h2>

      <TaskStatusLegend />

      <TaskFilter filters={filters} handleFilterChange={handleFilterChange} />

      {filteredTasks.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          {getNoTasksMessage()}
        </div>
      ) : (
        <div
          className={`card shadow-sm ${darkMode ? "bg-dark text-white" : ""}`}
        >
          <div className="card-body">
            <div className="row">
              {filteredTasks.map((task) => (
                <div className="col-md-4 col-sm-6 mb-3" key={task.id}>
                  <div
                    className={`card shadow-sm ${getStatusClass(task.status)} ${
                      darkMode ? "bg-dark text-white" : ""
                    }`}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{task.title}</h5>
                      <p className="card-text">{task.desc}</p>

                      <div className="mb-2">
                        <select
                          className={`form-select form-select-sm ${
                            darkMode ? "bg-dark text-white" : ""
                          }`}
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(
                              task.id,
                              e.target.value as TaskStatus
                            )
                          }
                          aria-label="Change Task Status"
                        >
                          <option value={TaskStatus.TODO}>To Do</option>
                          <option value={TaskStatus.IN_PROGRESS}>
                            In Progress
                          </option>
                          <option value={TaskStatus.DONE}>Done</option>
                        </select>
                      </div>

                      <div className="d-flex justify-content-between mt-3">
                        <Link
                          to={`/edit-task/${task.id}`}
                          className={`btn btn-warning btn-sm ${
                            darkMode ? "btn-light" : ""
                          }`}
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task.id, task.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
