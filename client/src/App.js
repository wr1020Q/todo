import { useEffect ,useContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import ErrorBanner from "./component/ErrorBanner";
import { TaskProvider } from "./context/TaskContext";
import { ErrorProvider, ErrorContext } from './context/ErrorContext';
import { registerErrorNotifier } from './utils/errorNotifier';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  CalendarTodo  from "./page/Calendar";
import  LoginForm  from "./page/LoginForm.jsx";
import  Register  from "./page/register.jsx";
import TodoApp from "./TodoApp";
import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
   const { setError } = useContext(ErrorContext);
    console.log('👀 AppContent rendered');

    useEffect(() => {
      console.log('🔥 useEffect for registerErrorNotifier is called');
      registerErrorNotifier(setError); // Axios→React 連携
    }, [setError]);

    return (
      <>
        <ErrorBanner />
      </>
    );
};

function App() {
  
  return (
    <ErrorProvider>
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
        <AppContent />
         </AuthProvider>
      </BrowserRouter>
     
    </TaskProvider>
    </ErrorProvider>

  );
}


export default App;
