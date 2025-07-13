
import { useState, useEffect} from "react";
import TaskInput from "./component/TaskInput";
import Navbar from "./component/Navbar";
import { TaskContext } from "./context/TaskContext";
import CategoryInput from "./component/CategoryInput";
import { useContext } from "react"; 
import TaskListWrapper from "./component/TaskListWrapper";
import 'react-calendar/dist/Calendar.css';
import { useTasks } from "./hooks/useGetTasks";
import { useGetCategories } from "./hooks/useGetCategories"; 

export default function TodoApp() {
  const { state, dispatch } = useContext(TaskContext);
  const { editText ,isLoading} = state;
  const [selectedDate] = useState(new Date());
  const { fetchTasks } = useTasks();
  const { fetchCategories } = useGetCategories();

  useEffect(() => {
    fetchTasks();
    fetchCategories()
  }, []);

  const {categories} =   useContext(TaskContext);
  

const tasksForSelectedDate = Array.isArray(state.tasks)
  ? state.tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate).toDateString() === selectedDate.toDateString()
    )
  : [];
  
  return (
    <>
    <Navbar />
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">ToDo アプリ</h1>

      {isLoading ? (
      <p>読み込み中...</p>
      
    ) : (
      <>
      <TaskInput
        categories={categories}
        setDueDate={(date) => dispatch({ type: "SET_DUE_DATE", payload: date })}
      />

      <TaskListWrapper
        tasks={tasksForSelectedDate}
        categories={categories}
      />
        <CategoryInput/>
      </>
      )}
  </div>
</>
  );
}
