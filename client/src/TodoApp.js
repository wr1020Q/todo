
import { useEffect,useRef ,useState,useMemo} from "react";

import Navbar from "./component/Navbar";
import { TaskContext } from "./context/TaskContext";

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
  const [searchQuery, setSearchQuery] = useState("");
  const { tasks, categoryFilter } = state;

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

      // 検索
      const filteredTasks = useMemo(() => {
        const result = Array.isArray(tasks)
          ?tasks.filter((task) => {
          const text = (task.text ?? "").toLowerCase();
          const keyword = searchQuery.toLowerCase();
          const matchesCategory = Array.isArray(categoryFilter) ? categoryFilter.length === 0 || 
            categoryFilter.some((f) => {
            const taskCatId = task.category?._id ?? task.category;
            return String(f) === String(taskCatId);
          })
          : true;
          const matchesKeyword = searchQuery.trim() === "" || text.includes(keyword);
          return matchesCategory && matchesKeyword;
        }):[];
    
        return result;
      }, [ tasks,categoryFilter, searchQuery]);
   
      console.log("親filteredTasks",filteredTasks)
  
  return (
    <>
      <Navbar 
          setSearchQuery={setSearchQuery}
          searchQuery = {searchQuery}
      />
      
      <div className="bg-gray-100 min-h-screen animate-slideDown">
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-white shadow rounded-lg p-4 ">

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                  <span className="ml-4 text-gray-600">読み込み中...</span>
                </div>
        
            ):(
                <TaskListWrapper
                  tasks={filteredTasks}
                  categories={categories}
                />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
