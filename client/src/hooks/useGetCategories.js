import { useCallback ,useContext} from "react";
import { getCategoriesAPI } from "../services/TaskService"; 
import { TaskContext } from "../context/TaskContext"; 

export const useGetCategories = () => {
  const { dispatch } = useContext(TaskContext);
  const {setCategories} =  useContext(TaskContext);
  
  const fetchCategories = useCallback(async () => {
    try {
      const category = await getCategoriesAPI();
      setCategories(category.data)
      console.log("取得したカテゴリー(F)：",category)
    } catch (err) {
      console.error("カテゴリー取得失敗:", err);
      throw err
    }
  }, [dispatch]);

  return { fetchCategories };
};