import React from "react";

export default function TaskItem({ task, onToggleComplete, onDelete, onStartEditing, onSaveEdit, onToggleTask, isEditing, editText, setEditText, onPriorityChange }) {
  const priorityClass = {
    "高": "bg-red-200",
    "中": "bg-yellow-200",
    "低": "bg-green-200"
  }[task.priority] || "";

  return (
    <li
      onDoubleClick={() => onStartEditing(task.id, task.text)}
      className={`flex justify-between items-center p-2 border-b ${priorityClass}`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={() => onSaveEdit(task.id)}
          onKeyDown={(e) => e.key === "Enter" && onSaveEdit(task.id)}
          autoFocus
        />
      ) : (
        <>
          <span
            className={`task-container ${task.completed ? "completed" : ""}`}
            onClick={() => onToggleTask(task.id)}
          >
            {task.text}-
          </span>
          <select
            value={task.priority}
            onChange={(e) => onPriorityChange(task.id, e.target.value)}
            className="border p-2 rounded"
          >
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
        </>
      )}
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500"
      >
        タスクの削除
      </button>
    </li>
  );
}
