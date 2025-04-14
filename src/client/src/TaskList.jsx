import React from "react";
// import { TaskContext } from "../context/TaskContext";
import { useMemo } from "react";
// import TaskItem from "./TaskItem";



export default function TaskList({
  tasks,
  categories,
  startEditing,
  editText,
  setEditText,
  saveEdit,
  toggleTask,
  toggleComplete,
  deleteTask,
  updatePriority,
  removeCategory,
  updateDueDate,
  categoryFilter
}) {

  console.log("受け取ったLIST内 tasks:", tasks);
  console.log("受け取ったLIST内 categories:", categories);


  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      categoryFilter.length === 0 || categoryFilter.includes(task.category)
    );
  }, [tasks, categoryFilter]);

  
  return (
    <div>
      {categories.map((cat) => {
        const tasksInCategory = filteredTasks.filter((task) => task.category === cat);
        if (tasksInCategory.length === 0) return null;

        return (
          <div key={cat} className="mb-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg mt-4">{cat}</h2>
              {cat !== "未分類" && (
                <button
                  onClick={() => removeCategory(cat)}
                  className="text-red-500 text-sm"
                >
                  削除
                </button>
              )}
            </div>

            <ul>
              {tasksInCategory.map((task) => (
                <li
                  key={task.id}
                  className={`flex justify-between items-center p-2 border-b
                    ${task.priority === "高" ? "bg-red-200" : ""}
                    ${task.priority === "中" ? "bg-yellow-200" : ""}
                    ${task.priority === "低" ? "bg-green-200" : ""}
                  `}
                  onDoubleClick={() => startEditing(task.id, task.text)}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="mr-2"
                  />
                  {task.isEditing ? (
                    <><input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(task.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                      autoFocus
                      className="flex-grow" /></>
                  ) : (
                    <>
                      <span
                        className={`flex-grow cursor-pointer ${
                          task.completed ? "line-through text-gray-400" : ""
                        }`}
                        onClick={() => toggleTask(task.id)}
                      >
                        {task.text}
                      </span>
                      <select
                        value={task.priority}
                        onChange={(e) =>updatePriority(task.id, e.target.value)}
                        className="border p-1 rounded text-sm mr-2"
                      >
                        <option value={1}>高</option>
                        <option value={2}>中</option>
                        <option value={3}>低</option>
                      </select>
                      <input
                        type="date"
                        value={task.dueDate || ""}
                        onChange={(e) => updateDueDate(task.id, e.target.value)} />
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 text-sm"
                      >
                        削除
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
