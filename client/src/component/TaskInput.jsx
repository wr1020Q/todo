import { TaskContext } from "../context/TaskContext";
import { useContext } from "react"; 
import TaskForm from "./TaskForm";

export default function TaskInput({ categories, }) {
  const { state, dispatch } = useContext(TaskContext);
  const { categoryFilter} = state;

  console.log('現在のcategoryFilter,INPUT:', categoryFilter); 
  console.log('現在のcategories,INPUT:', categories);

  return (
    <div className="flex mb-4 ">
      <TaskForm categories = {categories}/>
      <p>カテゴリーで絞り込み：</p>
          {Array.isArray(categories) ?(categories.map((category) => (
            <label key={category._id + "-checkbox"} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={categoryFilter.includes(category._id)}
              onChange={() =>dispatch({ type: "TOGGLE_CATEGORY_FILTER", payload: category._id })}
            />
              {category.title}
            </label>
          ))) : (
            <label key="no-category-checkbox" style={{ marginRight: '10px' }}>
              カテゴリなし
            </label>
          )}
    </div>
  );
};
