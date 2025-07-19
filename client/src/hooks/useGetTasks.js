import { useCallback ,useContext} from "react";
import { getTasksAPI } from "../services/TaskService"; 
import { TaskContext } from "../context/TaskContext"; 

export const useTasks = () => {
  const { dispatch } = useContext(TaskContext);

  const fetchTasks = useCallback(async () => {
    try {
      const task = await getTasksAPI();
      console.log('取得タスク:', task);
      dispatch({ type: "INIT_TASKS", payload: task.data });
    } catch (err) {
      console.error("タスク取得失敗:", err);
      throw err
    }
  }, [dispatch]);

  return { fetchTasks };
};