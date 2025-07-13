import { TaskContext } from "../context/TaskContext"; 
import TaskList from "./TaskList";
import { useMemo, useState ,useContext } from "react";

export default function TaskListWrapper({categories}) {
  const { state, dispatch } = useContext(TaskContext);
  const { tasks, categoryFilter, sortBy } = state;
  const [searchQuery, setSearchQuery] = useState("");

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
  }, [state.tasks, categoryFilter, searchQuery]);


  console.log("受け取ったWLIST内 tasks:", tasks);
  console.log("受け取ったWLIST内 categories:", categories);
  console.log("受け取ったWLIST内 categoryFilter:", categoryFilter);
  console.log("filteredTasks W:", filteredTasks);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case "deadlineAsc":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "deadlineDesc":
          return new Date(b.dueDate) - new Date(a.dueDate);
        case "priority":
          return b.priority - a.priority;
        case "createdAtDesc":
          return new Date(b.id) - new Date(a.id);
        default:
          return 0;
      }
    });
  }, [filteredTasks, sortBy]);
  
    console.log("sortedTasks W:", sortedTasks);
  return (
    <>
      <input
        type="text"
        placeholder="キーワードで検索"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      <select
        value={sortBy}
        onChange={(e) =>dispatch({ type: "SET_SORT", payload: e.target.value })}
      >
        <option value="deadlineAsc">締切が近い順</option>
        <option value="deadlineDesc">締切が遠い順</option>
        <option value="priority">優先度が高い順</option>
        <option value="createdAtDesc">作成日が新しい順</option>
      </select>

      <TaskList
        tasks={sortedTasks}
        categories = {categories}
        setEditText={(text) => dispatch({ type: "START_EDITING", payload: { id: null, text } })}
      />
    </>
  );  
}