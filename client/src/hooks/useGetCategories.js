import { useCallback ,useContext} from "react";
import { getCategories } from "../services/TaskService"; 
// import { setCategories } from "../useCategories";
import { TaskContext } from "../context/TaskContext"; 

export const useGetCategories = () => {
  const { dispatch } = useContext(TaskContext);
  const {setCategories} =  useContext(TaskContext);
  
  const fetchCategories = useCallback(async () => {
    try {
      const category = await getCategories();
      setCategories(category.data)
      console.log("取得したカテゴリー(F)：",category)
    } catch (err) {
      console.error("カテゴリー取得失敗:", err);
    }
  }, [dispatch]);

  return { fetchCategories };
};