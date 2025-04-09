import { createContext, useReducer, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import DOMPurify from "dompurify";
// console.log("CONTEXT",SECRET_KEY);
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
export const TaskContext = createContext();

const initialState = {
  tasks: [],
  editText: "",
  dueDate: "",
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
            return {
              ...state,
              tasks: [
                ...state.tasks,
                {
                  // id: Date.now() + Math.random(),
                  id: Date.now(),
                  text: action.payload.text,
                  completed: false,
                  priority: Number(action.payload.priority),
                  category: action.payload.category,
                  dueDate: action.payload.dueDate,
                },
              ],
            };
        case "DELETE_TASK":
          return{
              ...state,
              tasks: state.tasks.filter(task => task.id !== action.payload.id)
          };
        case "START_EDITING":
            return {
              ...state,
              tasks: state.tasks.map(task =>
                task.id === action.payload.id
                  ? { ...task, isEditing: true }
                  : task
              ),
              editText: action.payload.text,
            };
        case "SAVE_EDIT":
            const sanitized = DOMPurify.sanitize(state.editText);
            return {
                ...state,
                tasks: state.tasks.map(task =>
                task.id === action.payload.id
                    ? { ...task, text: sanitized, isEditing: false }
                    : task
                ),
                  editText:""
            };
        case "TOGGLE_TASK":
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.id
                    ? { ...task, completed: !task.completed }
                    : task
                ),
                    editText:""
            };
        case "UPDATE_PRIORITY":
            return {
                ...state,
                tasks: state.tasks.map(task =>
                task.id === action.payload.id
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
                    task.id === action.payload.id
                      ? { ...task, dueDate: action.payload.dueDate }
                      : task
                  )
                };
        case "TOGGLE_COMPLETE":
              const { payload: category } = action;
              const isSelected = state.categoryFilter.includes(category);
              return {
                ...state,
                categoryFilter: isSelected
                ? state.categoryFilter.filter(c => c !== category) // 解除
                : [...state.categoryFilter, category],             // 追加
          };
        case 'SET_CATEGORY_FILTER':
          console.log('新しいカテゴリフィルター:', action.payload); 
            return {
                ...state,
                categoryFilter: action.payload,
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
    const isFirstRender = useRef(true);
    const [state, dispatch] = useReducer(taskReducer, initialState);
    
    // useEffect(() => {
    //   console.log("ローカルストラテジー読み込んだよ")
    //   try {
    //     const encryptedData = localStorage.getItem("tasks");
    //     console.log("encryptedData:", encryptedData);
    //     if (!encryptedData) return;
      
    //     const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    //     const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    //     console.log("復号した文字列:", decryptedData);

    //     if (Array.isArray(decryptedData)) {
    //       dispatch({ type: "INIT_TASKS", payload: decryptedData });
    //     }
    //   } catch (error) {
    //     console.error("ローカルストレージ読み込みエラー:", error);
    //     dispatch({ type: "INIT_TASKS", payload: [] });
    //   }
    // }, []);

    useEffect(() => {
      console.log("現在の state.tasks:", state.tasks); 
      console.log("ローカルストラテジー読み込んだよ");
      try {
        const encryptedData = localStorage.getItem("tasks");
        console.log("encryptedData:", encryptedData);
       
        if (!encryptedData) return;
    
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        localStorage.setItem("test", "hello") 
    
        if (!decryptedString) {
          console.warn("復号した文字列が空です！");
          return;
        }
    
        const parsedTasks = JSON.parse(decryptedString);
        console.log("復号＆パース成功:", parsedTasks);
        console.log("保存されたか確認:", localStorage.getItem("tasks"));
        if (Array.isArray(parsedTasks)) {
          dispatch({ type: "INIT_TASKS", payload: parsedTasks });
        } else {
          console.warn("復号したデータが配列じゃない:", parsedTasks);
        }
      } catch (error) {
        console.error("ローカルストレージ読み込みエラー:", error);
        dispatch({ type: "INIT_TASKS", payload: [] });
      }
    }, []);

  useEffect(() => {
    console.log("タスク保存処理走った！"); 
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(state.tasks), SECRET_KEY).toString();
      localStorage.setItem("tasks", encrypted);
      console.log("保存直前の tasks:", encrypted);
    } catch (error) {
      console.error("ローカルストレージ保存エラー:", error);
    }
  }, [state.tasks]);
  
return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
