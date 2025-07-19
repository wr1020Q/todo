

import {React ,useEffect,useState}from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function TaskItem({
  task,
  editingTaskId,
  startEditing,
  toggleTask,
  updatePriority,
  updateDueDate,
  handleUpdateTask,
  deleteTask,
  errorMessage,
}) {
  const isEditing = editingTaskId === task._id;
  const [localEditText, setLocalEditText] = useState("");
  
  useEffect(() => {
    if (isEditing) {
      setLocalEditText(task.text); // 編集開始時だけセット
    }
  }, [isEditing, task.text]);

  return (
    <li
      key={task._id}
      className={`flex justify-between items-center p-2 border-b
        ${task.priority === 1 ? "bg-red-200" : ""}
        ${task.priority === 2 ? "bg-yellow-200" : ""}
        ${task.priority === 3 ? "bg-green-200" : ""}
      `}
      onDoubleClick={() => startEditing(task._id, task.text)}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task._id, !task.completed)}
        className="mr-2"
      />
      {isEditing ? (
      <>
        <input
          type="text"
          value={localEditText}
          onChange={(e) => setLocalEditText(e.target.value)}
          onBlur={() => handleUpdateTask(task._id, localEditText)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); 
              handleUpdateTask(task._id, localEditText);
            }     
          }}
          autoFocus
          className="flex-grow"
        />
        {errorMessage && <p className="text-red-500 text-xs italic ml-2">{errorMessage}</p>}
      </>
      ) : (
        <>
          <span
            className={`flex-grow cursor-pointer ${task.completed ? "line-through text-gray-400" : ""}`}
            onClick={() => toggleTask(task._id, task.completed)}
            onDoubleClick={() => startEditing(task._id, task.text)}
          >
            {task.text}
          </span>
          <select
            value={task.priority}
            onChange={(e) => updatePriority(task._id, e.target.value)}
            className="border p-1 rounded text-sm mr-2"
          >
            <option value={1}>高</option>
            <option value={2}>中</option>
            <option value={3}>低</option>
          </select>
          <input
            type="date"
            value={task.dueDate ? task.dueDate.split("T")[0] : ""}
            onChange={(e) => updateDueDate(task._id, e.target.value)}
            className="mr-2"
          />
          <button
            type="button"
            onClick={() => deleteTask(task._id)}
            className="text-red-500 text-sm"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </>
      )}
    </li>
  );
}
