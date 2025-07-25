import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { TaskProvider } from "./context/TaskContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  CalendarTodo  from "./page/Calendar";
import  LoginForm  from "./page/LoginForm.jsx";
import  Register  from "./page/register.jsx";
import TodoApp from "./TodoApp";
import { AuthProvider } from './context/AuthContext';


function App() {
  
  return (
    <TaskProvider>
       <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/calendar" element={<CalendarTodo />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<TodoApp />} />
          </Routes>
          <ToastContainer position="top-center" autoClose={3000} />
         </AuthProvider>
      </BrowserRouter>
    </TaskProvider>
  );
}


export default App;
