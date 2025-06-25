import { useMemo ,useState} from "react";

import { updateTaskAPI } from "../services/TaskService";
import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { deleteTaskAPI } from "../services/TaskService"; 

export default function TaskList({
  tasks = [],
  categories = [],
  // startEditing,
  editText,
  setEditText,
  // saveEdit,
  // toggleTask,
  toggleComplete,
  // updatePriority,
  removeCategory,
  // updateDueDate,
  categoryFilter
}) {

  console.log("受け取ったLIST内 tasks:", tasks);
  console.log("受け取ったLIST内 categories:", categories);
  console.log("受け取ったLIST内 categoryFilter:", categoryFilter);
  const {  dispatch } = useContext(TaskContext);
  const [editingTaskId, setEditingTaskId] = useState(null);



  const toggleTask=async(id,newcompleted)=>{
    console.log("newcompleted",newcompleted)
     dispatch({ type: "TOGGLE_TASK", payload: { id } })
     await updateTaskAPI(id, { completed: newcompleted });
  }

  const  updatePriority =async (id, newPriority) =>{
    dispatch({ type: "UPDATE_PRIORITY", payload: { id, newPriority } })
    await updateTaskAPI(id, { priority: newPriority });
  }
  
  const  updateDueDate=async(id, dueDate) =>{
    dispatch({ type: "UPDATE_DUE_DATE", payload: { id, dueDate } })
    await updateTaskAPI(id, { dueDate: dueDate });
  }
                 
  const startEditing = (taskId, currentText) => {
    setEditingTaskId(taskId);
    setEditText(currentText);
  };

  const handleUpdateTask = async (taskId, updatedFields) => {
    console.log("List Task更新",taskId,updatedFields)
  try {
     await updateTaskAPI(taskId, {text:updatedFields} );
      dispatch({type: "SAVE_EDIT", payload: { id: taskId, text: updatedFields } });
      setEditingTaskId(null);
      setEditText("");
  } catch (err) {
    console.error("タスクの更新に失敗しました:", err);
  }
};

  const deleteTask = async (id) => {
    await deleteTaskAPI(id);
    console.log("DELETE_TASK", id);
    dispatch({ type: "DELETE_TASK", payload: { id } });
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
                    // onChange={() => toggleComplete(task._id)}
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
