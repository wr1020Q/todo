import { TaskContext } from "../context/TaskContext";
import { useContext,useState } from "react"; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addTaskSchema } from '../utils/schema';
import { addTask} from '../services/TaskService';
import {showSuccess,showError} from "../utils/toast";

export default function TaskInput({ 
  categories,  
}) {
  const { state, dispatch } = useContext(TaskContext);
  const { dueDate ,categoryFilter} = state;
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addTaskSchema),
  });

  const onSubmit = async (data) => {
    console.log('送信データ:', data);
    await handleAddTask();
  };

  const onError = (errors) => console.log(errors);

    const handleAddTask = async () => {
      try{
        console.log("handleAddTask",selectedCategory)
        const newTask = {
          text: task,
          priority,
          category: selectedCategory ,
          dueDate
        };
  
        const createdTask= await addTask(newTask);
        console.log("handleAddTask返されたタスク",createdTask.data)
        dispatch({ type: "ADD_TASK",payload:  createdTask.data });
        setTask("");
        setPriority(2);
        setSelectedCategory("");
        dispatch({ type: "SET_DUE_DATE", payload: "" });
        showSuccess("タスクを新しく追加しました")
      }catch(e){
        showError("タスクを追加できませんでした")
      }
    };

  console.log('現在のcategoryFilter,INPUT:', categoryFilter); 
  console.log('現在のcategories,INPUT:', categories);

  return (
    <div className="flex mb-4">
      <form onSubmit={handleSubmit(onSubmit,onError)}>
        <input
          {...register('text')} 
          type="text" 
          value={task ?? ""} 
          onChange={(e) => setTask(e.target.value)}
          className="border p-2 flex-grow rounded-l"
          placeholder="タスクを入力..."
        />
        {errors.text && <p style={{ color: 'red' }}>{errors.text.message}</p>}
        <select
        {...register('priority')}  
          value={priority ?? ""} 
          onChange={(e)=>setPriority(Number(e.target.value))}  
          className="border p-2 rounded"
        >
          <option key="1" value={1}>高</option>
          <option key="2" value={2}>中</option>
          <option key="3" value={3}>低</option>
        </select>
        {errors.priority && <p style={{ color: 'red' }}>{errors.priority.message}</p>}
        <select 
          {...register('category')} 
          value={selectedCategory ?? ""} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          className="border p-2 rounded"
        >
          <option value="">カテゴリを選択してください</option>
        {(categories ?? []).map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.title}</option>))}
        </select>
        {errors.category && <p style={{ color: 'red' }}>{errors.category.message}</p>}
          <input
          {...register('dueDate')}
            type="date"
            value={dueDate ?? ""}
            onChange={(e) => dispatch({ type: "SET_DUE_DATE", payload: e.target.value })}
            className="border p-2 rounded"
          />
          {errors.dueDate && <p style={{ color: 'red' }}>{errors.dueDate.message}</p>}
        <button type="submit"  className="bg-blue-500 text-white p-2 rounded-r">
          追加
        </button>
      </form>
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
