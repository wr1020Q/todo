import { useMemo ,useState} from "react";

import { updateTaskAPI } from "../services/TaskService";
import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { deleteTaskAPI ,updateCategoryAPI} from "../services/TaskService"; 
import {showSuccess,showError} from "../utils/toast";
import { updateTaskSchema,updatePrioritySchema,updateDueDateSchema,updateCompletedSchema,addCategorySchema } from '../utils/schema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import TaskItem from "./TaskItem";
import { useAuth } from '../context/AuthContext';

export default function TaskList({ tasks = [],categories = [],setEditText }) {
  
  const { state, dispatch ,setCategories,removeCategory} = useContext(TaskContext);
  const { categoryFilter,editText} = state;
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryEdit, setCategoryEdit] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageCat, setErrorMessageCat] = useState("");
   const { user  } = useAuth();

  console.log("受け取ったLIST内 tasks:", tasks);
  console.log("受け取ったLIST内 categories:", categories);
  console.log("受け取ったLIST内 categoryFilter:", categoryFilter);

  const startEditing = (taskId, currentText) => {
    setEditingTaskId(taskId);
    setEditText(currentText);
    setErrorMessage("");
  };

  const startEditingCat = (catId, currentText) => {
    setEditingCategoryId(catId);
    setCategoryEdit(currentText);
    setErrorMessageCat("");
  };

  const toggleTask=async(id,newcompleted)=>{
    try {
          await updateCompletedSchema.validate({ completed: newcompleted });
          console.log("newcompleted",newcompleted)
          await updateTaskAPI(id, { completed: newcompleted });
          dispatch({ type: "TOGGLE_TASK", payload: { id } })
    } catch (err) {
        if (err.name === "ValidationError") {
          showError(err.message);  
          return; 
        }
        showError("タスクの状態を更新することができませんでした");
        console.error(err);
    }
  };

  const  updatePriority =async (id, newPriority) =>{
    try { 
          await updatePrioritySchema.validate({ priority: newPriority });
          await updateTaskAPI(id, { priority: newPriority });
          dispatch({ type: "UPDATE_PRIORITY", payload: { id, newPriority } })
          showSuccess("タスクの優先度を更新しました")
    } catch (err) {
        if (err.name === "ValidationError") {
          showError(err.message);  
          return; 
        }
        showError("タスクの優先度を更新することができませんでした");
        console.error(err);
    }
  };
  
  const  updateDueDate=async(id, dueDate) =>{
    try { 
          await updateDueDateSchema.validate({ dueDate: dueDate });
          await updateTaskAPI(id, { dueDate: dueDate });
          dispatch({ type: "UPDATE_DUE_DATE", payload: { id, dueDate } })
          showSuccess("タスクの期限を更新しました")
    } catch (err) {
        if (err.name === "ValidationError") {
          showError(err.message); 
          return; 
        }
        showError("タスクの期限を更新することができませんでした");
        console.error(err);
    }
  };
    
  //タスク更新
  const handleUpdateTask = async (taskId, updatedFields) => {
    try {
          console.log("List Task更新",taskId,updatedFields)
          await updateTaskSchema.validate({ text: updatedFields });
          await updateTaskAPI(taskId, {text:updatedFields} );
          dispatch({type: "SAVE_EDIT", payload: { id: taskId, text: updatedFields } });
          setEditingTaskId(null);
          setEditText("");
          showSuccess("タスクを更新しました")
    } catch (err) {
        if (err.name === "ValidationError") {
          setErrorMessage(err.message); 
          return; // ここで処理を止めるの
        }
        showError("タスクの更新ができませんでした");
        console.error(err);
    }
  };
  //カテゴリー更新
    const handleUpdateCategory = async (catId, updatedFields) => {
      try{
          await addCategorySchema.validate({ title: updatedFields });
          const updated = await updateCategoryAPI(catId, updatedFields)
          setCategories(preCategories => preCategories.map(cat => cat._id === updated.data._id ? {...cat,...updated.data}:cat))
          setEditingCategoryId(null);
          setCategoryEdit("")
          showSuccess("カテゴリーを更新しました")
      }catch (err) {
        if (err.name === "ValidationError") {
          setErrorMessageCat(err.message); 
          return; 
        }
        showError("カテゴリーの更新ができませんでした");
        console.error(err);
      }
    }

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
        const id = task.category?._id;
        return String(id) === String(cat._id);
      });

      if (tasksInCategory.length === 0) return null;

      return (
        <div key={cat._id + "input"} className="mb-4">
          <div className="flex items-center justify-between px-2 mt-4">
            {editingCategoryId === cat._id  ? (
              <>
                <input
                  type="text"
                  value={categoryEdit}
                  onChange={(e) => setCategoryEdit(e.target.value)}
                  onBlur={() => handleUpdateCategory(cat._id, categoryEdit)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); 
                      handleUpdateCategory(cat._id, categoryEdit);
                    }     
                  }}
                  autoFocus
                  className="flex-grow"
                />
                {errorMessageCat && (
                  <p className="text-red-500 text-xs italic ml-2">{errorMessageCat}</p>
                )}
              </>
            ) : (
              <>
                <h2 
                    onDoubleClick={() => {
                      if (cat.title !== "未分類"  &&  cat.user === user.id) {
                        startEditingCat(cat._id, cat.title);
                      }
                    }}
                  className="font-bold text-lg"
                >
                  {cat.title}
                </h2>
                {cat.title !== "未分類" &&  cat.user === user.id &&(
                  <button
                    onClick={() => removeCategory(cat._id, cat.title)}
                    className="text-red-500 text-sm"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </>
            )}
          </div>

          <ul>
            {tasksInCategory.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                editingTaskId={editingTaskId}
                editText={editText}
                startEditing={startEditing}
                toggleTask={toggleTask}
                updatePriority={updatePriority}
                updateDueDate={updateDueDate}
                handleUpdateTask={handleUpdateTask}
                deleteTask={deleteTask}
                errorMessage={errorMessage}
              />
            ))}
          </ul>
        </div>
      );
    })}
  </div>
);}