
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addCategorySchema } from '../utils/schema';
import { TaskContext } from "../context/TaskContext";
import { useContext } from "react"; 

export default function CategoryInput() {
    
    const {newCategory, setNewCategory, addCategory } =   useContext(TaskContext);
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(addCategorySchema),
    });

    const onSubmit = async (data) => {
      setNewCategory("")
      console.log('送信データ:', data);
      await addCategory();
    };
    return (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <input
                {...register('title')}
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border p-2 rounded mr-2"
                placeholder="新しいカテゴリ名"
              />
              {errors.title && (
                <p style={{ color: 'red' }}>{errors.title.message}</p>
              )}
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                カテゴリ追加
              </button>
            </form>
   
    )
}