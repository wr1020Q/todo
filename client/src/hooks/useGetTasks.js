import { useCallback ,useContext} from "react";
import { getTasks } from "../services/TaskService"; 
import { TaskContext } from "../context/TaskContext"; 

export const useTasks = () => {
  const { dispatch } = useContext(TaskContext);

  const fetchTasks = useCallback(async () => {
    try {
      const task = await getTasks();
      console.log('取得タスク:', task);
      dispatch({ type: "INIT_TASKS", payload: task.data });
    } catch (err) {
      console.error("タスク取得失敗:", err);
    }
  }, [dispatch]);

  return { fetchTasks };
};