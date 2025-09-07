import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addTaskSchema } from '../utils/schema';
import { addTaskAPI} from '../services/TaskService';
import {showSuccess,showError} from "../utils/toast";
import { useContext,useState,useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from 'react-dom';

import CategoryInput from "./CategoryInput";

export default function TaskForm({ categories}) {
    const {  dispatch } = useContext(TaskContext);
    const [showModal, setShowModal] = useState(false);

   const [selectedCategory, setSelectedCategory] = useState("");
    const {
            register,
            handleSubmit,
            formState: { errors },
            reset
            } = useForm({  resolver: yupResolver(addTaskSchema),});

    const onSubmit = async (data) => {
        
        dispatch({ type: "SET_DUE_DATE", payload: "" });
        console.log('送信データ:', data);
        await handleAddTask(data);
    };

    const onError = (errors) => console.log(errors);


    const handleAddTask = async (data) => {
      try{
        console.log("handleAddTask",selectedCategory)
        const newTask = {
          text: data.text,
          priority:Number(data.priority),
          category: data.category,
          dueDate:data.dueDate,
        };
  
        const createdTask= await addTaskAPI(newTask);
        console.log("handleAddTask返されたタスク",createdTask.data)
        dispatch({ type: "ADD_TASK",payload:  createdTask.data });
        showSuccess("タスクを新しく追加しました")
        reset()
      }catch(e){
        showError("タスクを追加できませんでした")
      }
    };

    function Modal({ children }) {
      return ReactDOM.createPortal(children, document.body);
    }
      return (
       <div>
        <button className=" text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent text-white mt-4  lg:inline-block lg:mt-0 text-white hover:bg-teal-500  " onClick={() => setShowModal(true)}>+ 追加</button>
      <AnimatePresence>
      {showModal && (
        <Modal>
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            style={{ zIndex: 9999 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="overlay"
          >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-96 p-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            key="modal"
          >
            <h2>新しいタスクを追加</h2>
              <form 
                onSubmit={handleSubmit(onSubmit,onError)}
                className="flex flex-col gap-4 p-4 bg-white rounded shadow mt-1 mb-4 ">
                <input
                  {...register('text')} 
                  type="text" 
                  // value={task ?? ""} 
                  // onChange={(e) => setTask(e.target.value)}
                  className="border p-2 flex-grow rounded-l"
                  placeholder="タスクを入力..."
                />
                {errors.text && <p style={{ color: 'red' }}>{errors.text.message}</p>}

                <select
                  {...register('priority')}  
                  // value={priority ?? ""} 
                  // onChange={(e)=>setPriority(Number(e.target.value))}  
                  className="border p-2 rounded"
                >
                  <option key="1" value={1}>高</option>
                  <option key="2" value={2}>中</option>
                  <option key="3" value={3}>低</option>
                </select>
                {errors.priority && <p style={{ color: 'red' }}>{errors.priority.message}</p>}

                <select 
                  {...register('category')} 
                  // value={selectedCategory ?? ""} 
                  // onChange={(e) => setSelectedCategory(e.target.value)} 
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
                    // value={dueDate ?? ""}
                    // onChange={(e) => dispatch({ type: "SET_DUE_DATE", payload: e.target.value })}
                    className="border p-2 rounded"
                />
                {errors.dueDate && <p style={{ color: 'red' }}>{errors.dueDate.message}</p>}

                <button type="submit"  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                  追加
                </button>
            </form>
            <h3>新しいカテゴリーを追加</h3>
              <CategoryInput/>
              <div className="flex justify-end">
                <button type="button" className="bg-red-500 text-white p-2 rounded ml-4 hover:bg-red-600 transition"  
                  onClick={() => {
                    reset();             // フォーム状態をリセット
                    setShowModal(false); // モーダル閉じる
                  }}>
                  閉じる
                </button>
              </div>
              
        </motion.div>
      </motion.div>
      </Modal>
    )}
    </AnimatePresence>
    </div>
      )
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
  },
};