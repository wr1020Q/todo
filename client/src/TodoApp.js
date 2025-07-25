
import { useEffect,useRef } from "react";
import TaskInput from "./component/TaskInput";
import Navbar from "./component/Navbar";
import { TaskContext } from "./context/TaskContext";
import CategoryInput from "./component/CategoryInput";
import { useContext } from "react"; 
import TaskListWrapper from "./component/TaskListWrapper";
import 'react-calendar/dist/Calendar.css';
import { useTasks } from "./hooks/useGetTasks";
import { useGetCategories } from "./hooks/useGetCategories"; 
import {showError} from "./utils/toast";
import { useAuth } from './context/AuthContext';

export default function TodoApp() {
  const didFetchRef = useRef(false);
  const { state } = useContext(TaskContext);
  const {categories} =   useContext(TaskContext);
  const { loading} = useAuth();
  const { fetchTasks } = useTasks();
  const { fetchCategories } = useGetCategories();

//初期データ取得
useEffect(() => {

  if (didFetchRef.current) return;
  didFetchRef.current = true;

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchTasks(), fetchCategories()]);
    } catch {
        showError("初期データの取得に失敗しました。");
    }
  };
  fetchInitialData();
}, []);

  
  return (
    <>
    <Navbar />
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-lg mt-5">
      <h1 className="text-xl font-bold mb-4">ToDo アプリ</h1>

      {loading ? (
        <p>読み込み中...</p>
      
      ):(
      <>
        <TaskInput
          categories={categories}
        />

        <TaskListWrapper
          tasks={state.tasks}
          categories={categories}
        />

        <CategoryInput/>
      </>
      )}
  </div>
</>
  );
}
