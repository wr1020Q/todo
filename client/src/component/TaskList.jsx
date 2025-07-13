import { useMemo ,useState} from "react";

import { updateTaskAPI } from "../services/TaskService";
import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { deleteTaskAPI } from "../services/TaskService"; 
import {showSuccess,showError} from "../utils/toast";
import { updateTaskSchema,updatePrioritySchema,updateDueDateSchema,updateCompletedSchema } from '../utils/schema';

export default function TaskList({
  tasks = [],
  categories = [],
  // editText,
  setEditText
}) {
  
  const {removeCategory} =   useContext(TaskContext);
  const { state, dispatch } = useContext(TaskContext);
  const { categoryFilter,editText} = state;
  const [editingTaskId, setEditingTaskId] = useState(null);

  console.log("受け取ったLIST内 tasks:", tasks);
  console.log("受け取ったLIST内 categories:", categories);
  console.log("受け取ったLIST内 categoryFilter:", categoryFilter);

  const startEditing = (taskId, currentText) => {
    setEditingTaskId(taskId);
    setEditText(currentText);
  };

  const toggleTask=async(id,newcompleted)=>{
    try {
          await updateCompletedSchema.validate({ completed: newcompleted });
          console.log("newcompleted",newcompleted)
          await updateTaskAPI(id, { completed: newcompleted });
          dispatch({ type: "TOGGLE_TASK", payload: { id } })
    } catch (err) {
      if (err.name !== 'ValidationError') {
          showError("タスクの優先度ができませんでした")
    }
  }
}

  const  updatePriority =async (id, newPriority) =>{
    try { 
          await updatePrioritySchema.validate({ priority: newPriority });
          await updateTaskAPI(id, { priority: newPriority });
          dispatch({ type: "UPDATE_PRIORITY", payload: { id, newPriority } })
          showSuccess("タスクの優先度を更新しました")
    } catch (err) {
      if (!err.name !== 'ValidationError') {
          showError("タスクの優先度ができませんでした")
      }
    }
  }
  
  const  updateDueDate=async(id, dueDate) =>{
    try { 
          await updateDueDateSchema.validate({ dueDate: dueDate });
          await updateTaskAPI(id, { dueDate: dueDate });
          dispatch({ type: "UPDATE_DUE_DATE", payload: { id, dueDate } })
          showSuccess("タスクの期限を更新しました")
    } catch (err) {
      if (!err.name !== 'ValidationError') {
          showError("タスクの期限が更新できませんでした")
      }
    }
  }
                 
  const handleUpdateTask = async (taskId, updatedFields) => {
    console.log("List Task更新",taskId,updatedFields)
    try {
          await updateTaskSchema.validate({ text: updatedFields });
          await updateTaskAPI(taskId, {text:updatedFields} );
          dispatch({type: "SAVE_EDIT", payload: { id: taskId, text: updatedFields } });
          setEditingTaskId(null);
          setEditText("");
          showSuccess("タスクを更新しました")
    } catch (err) {
      if (err.name !== 'ValidationError') {
          showError("タスクの更新ができませんでした")
          console.error("タスクの更新に失敗しました:", err);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
          await deleteTaskAPI(id);
          console.log("DELETE_TASK", id);
          dispatch({ type: "DELETE_TASK", payload: { id } });
    } catch (err) {
      showError("タスクの削除ができませんでした")
      console.error("タスクの削除に失敗しました:", err);
    }
  };

const filteredTasks = useMemo(() => {
  return Array.isArray(tasks)
    ? tasks.filter((task) => {
        const taskCatId = task.category?._id ?? task.category;
        return (
          categoryFilter.length === 0 ||
          categoryFilter.includes(String(taskCatId))
        );
      })
    : [];
}, [tasks, categoryFilter]);

  
  return (
    <div>
      {categories.map((cat) => {
        const tasksInCategory = filteredTasks.filter((task) => {
        const id = task.category?._id ;
        return String(id) === String(cat._id);});
        if (tasksInCategory.length === 0) return null;

        return (
          <div key={cat._id + "input"} className="mb-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg mt-4">{cat.title}</h2>
              {cat.title !== "未分類" && (
                <button
                  onClick={() => removeCategory(cat._id, cat.title)}
                  className="text-red-500 text-sm"
                >削除</button>
              )}
            </div>

            <ul>
              {tasksInCategory.map((task) => (
                <li
                  key={task._id + "input"}
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
                  {editingTaskId === task._id ?(
                    <><input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => handleUpdateTask(task._id,editText)}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdateTask(task._id,editText)}
                      autoFocus
                      className="flex-grow" /></>
                  ) : (
                    <>
                      <span
                        className={`flex-grow cursor-pointer ${
                          task.completed ? "line-through text-gray-400" : ""
                        }`}
                        onClick={() => toggleTask(task._id,task.completed)}
                        onDoubleClick={() => startEditing(task._id, task.text)}
                        >
                        {task.text}
                      </span>
                      <select
                        value={task.priority}
                        onChange={(e) =>updatePriority(task._id, e.target.value)}
                        className="border p-1 rounded text-sm mr-2"
                      >
                        <option value={1}>高</option>
                        <option value={2}>中</option>
                        <option value={3}>低</option>
                      </select>
                      <input
                        type="date"
                        value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                        onChange={(e) => updateDueDate(task._id, e.target.value)} />
                      <button
                      type="button"
                        onClick={() => deleteTask(task._id)}
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
