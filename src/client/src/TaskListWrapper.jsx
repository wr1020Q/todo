import { TaskContext } from "./context/TaskContext"; 
import TaskList from "./TaskList";
import { useMemo, useState ,useContext } from "react";

export default function TaskListWrapper({ categories,editText,dueDate,removeCategory }) {
  const { state, dispatch } = useContext(TaskContext);
  const { tasks, categoryFilter, sortBy } = state;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const text = (task.text ?? "").toLowerCase();
      const keyword = searchQuery.toLowerCase();
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(task.category);
      const matchesKeyword = searchQuery.trim() === "" || text.includes(keyword);
  
      // console.log({
      //   text,
      //   keyword,
      //   matchesCategory,
      //   matchesKeyword,
      //   included: matchesCategory && matchesKeyword,
      // });
  
      return matchesCategory && matchesKeyword;
    });
  
    return result;
  }, [tasks, categoryFilter, searchQuery]);

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
      />
    </>
  );
}