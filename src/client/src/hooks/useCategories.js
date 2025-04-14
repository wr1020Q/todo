import { useState } from 'react';
// import { useTasks } from "./useTasks";



export const useCategories = () => {
   const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : ["仕事", "家事", "勉強", "趣味", "未分類"];
  });
    const [selectedCategory, setSelectedCategory] = useState(categories[0] || "");
    const [newCategory, setNewCategory] = useState("");
    // const { tasks,setTasks} = useTasks(); 

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
          setCategories([...categories, newCategory]);
          setNewCategory(""); 
        }
      };
    


      return{
        categories,
        setCategories,
        selectedCategory,
        setSelectedCategory,
        newCategory,
        setNewCategory,
        addCategory,

      }
}