
import { useState, useEffect,useRef } from "react";
import TaskInput from "./component/TaskInput";
import { TaskContext } from "./context/TaskContext";
import CategoryInput from "./component/CategoryInput";
import { useContext } from "react"; 
import TaskListWrapper from "./component/TaskListWrapper";
// const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
import 'react-calendar/dist/Calendar.css';
import CalendarTodo from "./page/Calender";
import { useTasks } from "./hooks/useGetTasks";
import { useGetCategories } from "./hooks/useGetCategories"; 
import { getTasks, addTask, updateTask, deleteTask ,getCategorie, getCategories,deleteCategory} from './services/TaskService';


export default function TodoApp() {
  const { state, dispatch } = useContext(TaskContext);
  // const [tasks] = useState([]);
  const {  tasks,editText ,dueDate ,isLoading,categoryFilter} = state;
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState(2);
  const [selectedDate] = useState(new Date());
  const { fetchTasks } = useTasks();
  const { fetchCategories } = useGetCategories();

  useEffect(() => {
    fetchTasks();
    fetchCategories()
  }, []);

    const {
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    newCategory,
    setNewCategory,
    addCategory,
    setCategoryFilter
  } =   useContext(TaskContext);
  
  const handleAddTask = async () => {
    // console.log("handleAddTask:priority",priority)
    // const value = Number(priority);
    // console.log("選択された優先度:", value);
    console.log("handleAddTask",selectedCategory)
    const newTask = {
    text: task,
    priority,
    category: selectedCategory ,
    dueDate
  };

    const createdTask= await addTask(newTask);
    console.log("handleAddTask返されたタスク",createdTask.data)
    dispatch({ type: "ADD_TASK",payload:  createdTask.data });
    setTask("");
    setPriority(2);
    setSelectedCategory("");
    dispatch({ type: "SET_DUE_DATE", payload: "" });
  };

  const removeCategory = async(id, title) => {
    if (title === "未分類") return;
  
  try {
    await deleteCategory(id); 
    const res = await getTasks(); 
    const catRes = await getCategories();

    setCategories(catRes.data);
    dispatch({ type: "INIT_TASKS", payload: res.data });
  } catch (err) {
    console.error("カテゴリ削除エラー", err);
  }
  };


  const handleCheckboxChange = (category) => {
    console.log("handleCheckboxChange",category)
    dispatch({ type: "TOGGLE_CATEGORY_FILTER", payload: category });
};

const tasksForSelectedDate = Array.isArray(state.tasks)
  ? state.tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate).toDateString() === selectedDate.toDateString()
    )
  : [];
  
  return (

    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">ToDo アプリ</h1>

      {isLoading ? (
      <p>読み込み中...</p>
    ) : (
      <>
      <div className="my-4">
        <h2 className="text-lg font-semibold mb-2">📅 カレンダーから日付を選択</h2>
        <CalendarTodo />
      </div>

      <TaskInput
        task={task}
        setTask={setTask}
        priority={priority}
        handlePriorityChange={(e) => setPriority(Number(e.target.value))} 
        setPriority={setPriority}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        handleAddTask={handleAddTask}
        dueDate = {dueDate}
        setDueDate={(date) => dispatch({ type: "SET_DUE_DATE", payload: date })}
        handleCheckboxChange={handleCheckboxChange}
        categoryFilter={categoryFilter}
      />

      <TaskListWrapper
        tasks={tasksForSelectedDate}
        categories={categories}
        editText={editText}
        dueDate={dueDate}
        removeCategory={removeCategory}
        categoryFilter={state.categoryFilter}
      />

      <CategoryInput
        newCategory = {newCategory}
        setNewCategory = {setNewCategory}
        addCategory = {addCategory}
      />
      </>
      )}
  </div>
  );
}
