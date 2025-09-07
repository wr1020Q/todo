

import {useEffect,useState}from "react";
import { Trash2} from "lucide-react";
import { useAuth } from '../context/AuthContext';
import  DueDateStatus  from './DueDateStatus.jsx';

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
  const { user  } = useAuth();

  useEffect(() => {
    if (isEditing) {
      setLocalEditText(task.text); // 編集開始時だけセット
    }
  }, [isEditing, task.text]);

  return (
    <li
      key={task._id}
      tabIndex={0}
      className={`flex md:flex-row justify-between items-center p-2 border-b focus-within:border-blue-500  transition-colors md:flex-row `}
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
            if (e.key === "Enter" && task.user === user.id) {
              e.preventDefault(); 
              handleUpdateTask(task._id, localEditText);
            }     
          }}
          autoFocus
            className={"flex-grow border-0 focus:outline-none"}
        />
        {errorMessage && <p className="text-red-500 text-xs italic ml-2">{errorMessage}</p>}

      </>
      ) : (
        <>

 
          <span
            className={` flex-grow min-w-0 cursor-pointer  ${task.completed ? "line-through text-gray-400" : ""} break-words whitespace-normal`}
            onClick={() => toggleTask(task._id, task.completed)}
            onDoubleClick={() => startEditing(task._id, task.text)}
          >
            {task.text}
          </span>
          <div className="flex items-center gap-4">
          <select
            value={task.priority}
            onChange={(e) => updatePriority(task._id, e.target.value)}
            className={`border p-1 rounded text-sm mr-2 whitespace-nowrap
                        ${task.priority === 1 ? "bg-red-200 hover:bg-red-300" : ""}
                        ${task.priority === 2 ? "bg-yellow-200 hover:bg-yellow-300" : ""}
                        ${task.priority === 3 ? "bg-green-200 hover:bg-green-300" : ""}`}
          >
            <option value={1}>高</option>
            <option value={2}>中</option>
            <option value={3}>低</option>
          </select>
          <div className="flex flex-col flex-grow min-w-0 cursor-pointer">
            <div className="self-start mb-1">
              <DueDateStatus dueDate={task.dueDate} />
            </div>
            <input
              type="date"
              value={task.dueDate ? task.dueDate.split("T")[0] : ""}
              onChange={(e) => updateDueDate(task._id, e.target.value)}
              className="mr-2  border-0 hover:text-bule-600 force:text-bule-600 whitespace-nowrap"
            />
          </div>
          </div>
          <button
            type="button"
            onClick={() => deleteTask(task._id)}
            className="text-red-500 hover:text-red-700 text-sm border-0 outline-none focus:outline-none whitespace-nowrap"      
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
    </li>
  );
}
