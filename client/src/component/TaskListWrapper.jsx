import { TaskContext } from "../context/TaskContext"; 
import TaskList from "./TaskList";
import CategoriesList from "./CategoriesList";
import { useMemo,useContext } from "react";
import { SortAsc, SortDesc, Star, Clock } from "lucide-react";

import TaskInput from "./TaskInput";
import Select from 'react-select';


export default function TaskListWrapper({categories,tasks}) {
  const { state, dispatch } = useContext(TaskContext);
  const { categoryFilter, sortBy } = state;

  const options = [
    { value: "deadlineAsc", label: "締切が近い順", icon: <SortAsc size={16} /> },
    { value: "deadlineDesc", label: "締切が遠い順", icon: <SortDesc size={16} /> },
    { value: "priority", label: "優先度が高い順", icon: <Star size={16} /> },
    { value: "createdAtDesc", label: "作成日が新しい順", icon: <Clock size={16} /> },
  ];


  console.log("受け取ったWLIST内 tasks:", tasks);
  console.log("受け取ったWLIST内 categories:", categories);
  console.log("受け取ったWLIST内 categoryFilter:", categoryFilter);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case "deadlineAsc":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "deadlineDesc":
          return new Date(b.dueDate) - new Date(a.dueDate);
        case "priority":
          return a.priority - b.priority;
        case "createdAtDesc":
          return new Date(b.id) - new Date(a.id);
        default:
          return 0;
      }
    });
  }, [tasks, sortBy]);
  
  return (
    <>
    <div className="flex items-center gap-4 mb-2  justify-end ">
    <Select
      options={options}
      value={options.find((option) => option.value === sortBy) || null}
      onChange={(selectedOption) => {
        if (selectedOption) {
          dispatch({ type: "SET_SORT", payload: selectedOption.value });
        }
      }}
      getOptionLabel={option => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {option.icon}
          <span style={{ marginLeft: 8 }}>{option.label}</span>
        </div>
      )}
      isSearchable={false}
      placeholder="並び替え"
      className="w-64 text-sm fadeSlideRight"
    />

        <TaskInput categories={categories}/>
      </div>

      <div className="flex items-center gap-4  justify-end ">
          <CategoriesList categories={categories}/>
      </div>

        <TaskList
          tasks={sortedTasks}
          categories = {categories}
          setEditText={(text) => dispatch({ type: "START_EDITING", payload: { id: null, text } })}
        />
    </>





  );  
}