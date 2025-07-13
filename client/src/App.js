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
import  CalendarTodo  from "./page/Calender";
import  LoginForm  from "./page/LoginForm.jsx";
import  Register  from "./page/register.jsx";
import TodoApp from "./TodoApp";

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
console.log('CalendarTodo:', CalendarTodo);
console.log('LoginForm:', LoginForm);
//   console.log('ErrorContextModule:', ErrorContextModule);
//  console.log('ErrorBanner:', ErrorBanner);
// console.log('TodoApp:', TodoApp);
// console.log('TaskProvider:', TaskProvider);
// console.log('ErrorProvider:', ErrorProvider);
  return (
    <ErrorProvider>
    <TaskProvider>
       <BrowserRouter>
          <Routes>
          <Route path="/calendar" element={<CalendarTodo />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<TodoApp />} />
        </Routes>
         <ToastContainer position="top-center" autoClose={3000} />
        <AppContent />
      </BrowserRouter>
    </TaskProvider>
    </ErrorProvider>

  );
}


export default App;
