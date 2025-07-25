import { createContext, useReducer,useEffect, useState} from "react";
import { getCategoriesAPI, addCategoryAPI ,deleteCategoryAPI,getTasksAPI} from "../services/TaskService";
import {showSuccess,showError} from "../utils/toast";
export const TaskContext = createContext();

const initialState = {
  tasks: [],
  // editText: "",
  isLoading: true,
  categoryFilter: [],
  sortBy: "deadlineAsc", 
};

const taskReducer = (state, action) => {
    switch(action.type) {
        case "INIT_TASKS":
            return {
                ...state,
                tasks: action.payload,
                isLoading: false
            };
        case "ADD_TASK":
          console.log("ADD_TASK")
            return {
              ...state,
              tasks: [...(state.tasks || []), action.payload],
            };
        case "DELETE_TASK":
          return{
              ...state,
              tasks: state.tasks.filter(task => task._id !== action.payload.id)
          };
        case "START_EDITING":
            return {
              ...state,
              tasks: state.tasks.map(task =>
                task._id === action.payload.id
                  ? { ...task, isEditing: true }
                  : task
              ),
              editText: action.payload.text,
            };
        case "SAVE_EDIT":
            return {
                ...state,
                tasks: state.tasks.map(task =>
                task._id === action.payload.id
                    ? { ...task, text: action.payload.text, isEditing: false }
                    : task
                ),
                  editText:""
            };
        case "TOGGLE_TASK":
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task._id === action.payload.id
                    ? { ...task, completed: !task.completed }
                    : task
                ),
                    editText:""
            };
        case "UPDATE_PRIORITY":
            return {
                ...state,
                tasks: state.tasks.map(task =>
                task._id === action.payload.id
                    ? { ...task, priority: action.payload.newPriority }
                    : task
                ),
            };
        case "SET_DUE_DATE":
              return {
                  ...state,
                  dueDate: action.payload,
              };
        case "UPDATE_DUE_DATE":
              return {
                  ...state,
                  tasks: state.tasks.map(task =>
                    task._id === action.payload.id
                      ? { ...task, dueDate: action.payload.dueDate }
                      : task
                  )
                };
        case "TOGGLE_CATEGORY_FILTER":
              const categoryId = action.payload._id || action.payload; // ID を抽出
              const isSelected = state.categoryFilter.includes(categoryId);
              return {
                  ...state,
                  categoryFilter: isSelected
                  ? state.categoryFilter.filter((id) => id !== categoryId)
                  : [...state.categoryFilter, categoryId],
              };
        case 'SET_CATEGORY_FILTER':
              return {
                  ...state,
                  categoryFilter: action.payload.map(cat => typeof cat === 'object' ? cat._id : cat),
              };
        case "SET_SORT":
            return {
                ...state,
                sortBy: action.payload,
            };
      default:
        return state;
    }
  };

  export const TaskProvider = ({ children }) => {

  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = async () => {
    if (newCategory && categories.some(c => c.title === newCategory)) {
        showError("このカテゴリーは既に存在します");
        return;
    }
      try {
        console.log("新しいカテゴリー",newCategory)
        const updated = await addCategoryAPI(newCategory);
        setCategories(prev => [...prev, updated.data]); 
        setNewCategory("");
        showSuccess("カテゴリーを追加しました")
      } catch (err) {
        showError("カテゴリーを追加できませんでした")
        console.error("カテゴリ追加失敗:", err);
      }
    
  };
  
    const removeCategory = async(id, title) => {
      if (title === "未分類") return;
    
    try {
      await deleteCategoryAPI(id); 
      const res = await getTasksAPI(); 
      const catRes = await getCategoriesAPI();
  
      setCategories(catRes.data);
      dispatch({ type: "INIT_TASKS", payload: res.data });
      showSuccess("カテゴリーを削除しました")
    } catch (err) {
      showError("カテゴリーを削除できませんでした")
      console.error("カテゴリ削除エラー", err);
    }
    };
       
return (
       <TaskContext.Provider
      value={{
        state,
        dispatch,
        categories,
        setCategories,
        newCategory,
        setNewCategory,
        addCategory,
        removeCategory
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
