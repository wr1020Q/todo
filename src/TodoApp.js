
import { useState, useEffect,useRef } from "react";
// import CryptoJS from "crypto-js";
import React from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
// import { useTasks } from "./hooks/useTasks"; 
import { TaskContext } from "./context/TaskContext";
import { useCategories } from "./hooks/useCategories"; 
import CategoryInput from "./CategoryInput";
import { useContext } from "react"; 
import TaskListWrapper from "./TaskListWrapper";
// const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;


export default function TodoApp() {
 
  const { state, dispatch } = useContext(TaskContext);
  const { tasks, editText ,dueDate ,isLoading,categoryFilter} = state;

  const isFirstRender = useRef(true);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("中");

  const{
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    newCategory,
    setNewCategory,
    addCategory
  }=useCategories(tasks, (updatedTasks) =>
    dispatch({ type: "INIT_TASKS", payload: updatedTasks })
  );

  
  const handleAddTask = (text, priority, category, dueDate) => {
    dispatch({
      type: "ADD_TASK",
      payload: { text, priority, category, dueDate },
    });
    setTask("");
    setPriority("中");
    setSelectedCategory(categories[0] || "");
    dispatch({ type: "SET_DUE_DATE", payload: "" });
  };

  useEffect(() => {
    if (isFirstRender.current) return; 
    
    
    try {
      localStorage.setItem("categories", JSON.stringify(categories));
    } catch (error) {
      console.error("カテゴリ保存エラー:", error);
    }
  }, [categories]);



  const removeCategory = (categoryToRemove) => {
    if (categoryToRemove === "未分類") return;
  
    const updatedCategories = categories.filter((c) => c !== categoryToRemove);
    const updatedTasks = tasks.map(task =>
      task.category === categoryToRemove ? { ...task, category: "未分類" } : task
    );
  
    if (!updatedCategories.includes("未分類")) {
      updatedCategories.push("未分類");
    }
  
    setCategories(updatedCategories);
    dispatch({ type: "INIT_TASKS", payload: updatedTasks });
  };

  // const filteredTasks = tasks.filter((task) =>
  //   categoryFilter.length === 0 || categoryFilter.includes(task.category)
  // );
  const handleCategoryFilterChange = (category) => {
    
    const updatedFilter = categoryFilter.includes(category)
      ? categoryFilter.filter((cat) => cat !== category) // 選択解除
      : [...categoryFilter, category]; // 選択
      console.log("新しいカテゴリフィルター,handleCategoryFilterChange:", updatedFilter);
    dispatch({ type: "SET_CATEGORY_FILTER", payload: updatedFilter });
    console.log("アクションがdispatchされました");
  };


  //TASKSの中身
  useEffect(() => {
    console.log("タスク更新:", tasks);
  }, [tasks]);
  
  return (

    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">ToDo アプリ</h1>

      {isLoading ? (
      <p>読み込み中...</p>
    ) : (
      <>
      <TaskInput
        task={task}
        setTask={setTask}
        priority={priority}
        handlePriorityChange={(e) => setPriority(e.target.value)} 
        setPriority={setPriority}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        addTask={handleAddTask}
        dueDate = {dueDate}
        setDueDate={(date) => dispatch({ type: "SET_DUE_DATE", payload: date })}
        handleCheckboxChange={handleCategoryFilterChange}
        categoryFilter={categoryFilter}
      />

      {/* <TaskList
        tasks={tasks}
        categories={categories}
        editText={editText}
        setEditText={(text) => dispatch({ type: "START_EDITING", payload: { id: null, text } })}
        startEditing={(id, text) => dispatch({ type: "START_EDITING", payload: { id, text } })}
        saveEdit={(id) => dispatch({ type: "SAVE_EDIT", payload: { id } })}
        toggleTask={(id) => dispatch({ type: "TOGGLE_TASK", payload: { id } })}
        toggleComplete={(id) => dispatch({ type: "TOGGLE_COMPLETE", payload: { id } })}
        deleteTask={(id) => dispatch({ type: "DELETE_TASK", payload: { id } })}
        updatePriority={(id, newPriority) =>
          dispatch({ type: "UPDATE_PRIORITY", payload: { id, newPriority } })
        }
        removeCategory={removeCategory}
        dueDate={dueDate}
        updateDueDate={(id, dueDate) =>
          dispatch({ type: "UPDATE_DUE_DATE", payload: { id, dueDate } })}
          categoryFilter={categoryFilter}
      /> */}
      <TaskListWrapper
          categories={categories}
          editText={editText}
          dueDate={dueDate}
          removeCategory={removeCategory}
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
