import { useState,useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { TaskContext } from "../context/TaskContext";
import TaskForm from "./TaskForm";
import {ListTodo}   from "lucide-react";
import { Search } from "lucide-react";


export default function Navbar( {setSearchQuery,searchQuery }) {
    const {categories} =   useContext(TaskContext);
  const [isOpen, setIsOpen] = useState(false);
  const { user , logout } = useAuth();

  return (
    <>

    <nav className="flex items-center justify-between flex-wrap bg-gray-700 p-6 animate-slideDown">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        
        <ListTodo size={30}></ListTodo>
        <Link to="/" className="font-semibold text-xl tracking-tight ml-6 hover:text-teal-500">ホーム</Link>
      </div>

      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 border rounded  text-white border-white hover:text-teal-500 hover:border-teal-500"
        >
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
      </div>


      <div
          className={`w-full block lg:flex-grow lg:flex lg:flex-row lg:justify-between flex-col lg:items-center lg:w-auto  space-y-2 lg:space-x-4
            transition-all duration-300 ease-out 
            ${isOpen ? " max-h-70 opacity-100 translate-y-0" : " max-h-0 opacity-0 -translate-y-2"}
            ${!isOpen ? " lg:max-h-full lg:opacity-100 lg:translate-y-0" : ""}
          `}>


        <div className="lg:flex flex-col  lg:items-center lg:space-x-4 p-4 lg:p-0">
          {user ? (
            <>
            <div className="flex flex-col lg:flex-row lg:items-center ">
              <p onClick={logout} className="inline-block mt-4 lg:inline-block lg:mt-0 text-white hover:text-teal-500 mr-4">ログアウト</p>
              <Link to="/calendar" className="inline-block mt-4 lg:inline-block lg:mt-0 text-white hover:text-teal-500 mr-4">カレンダー</Link>
              <TaskForm categories = {categories} />
            </div>
            </>
          ):(
            <>
              <Link to="/login" className=" block mt-4 lg:inline-block lg:mt-0 text-white hover:text-teal-500 mr-4">ログイン</Link>
              <Link to="/register" className=" block mt-4 lg:inline-block lg:mt-0 text-white hover:text-teal-500 mr-4">新規登録</Link>
            </>
          )}


        </div>
          <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-start  lg:p-0 space-y-4 lg:space-y-0 lg:space-x-4">
          {user ? (
            <>
              <div className="relative  w-60 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="タスク名で検索..."
                  className="w-full border p-2 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-300 hover:bg-white transition-colors duration-200"
                />
              </div>
              <a href="#" className=" w-fit text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent teal-500 hover:bg-teal-500 lg:mt-0">{user.user} さん</a>
            </>
          ):(
            <a href="#" className=" text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent teal-500 hover:bg-teal-500 mt-4 lg:mt-0">ゲスト さん</a>
            )}
        </div>

      </div>


    </nav>
    </>
  );
}
