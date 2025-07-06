import { useEffect ,useContext } from "react";
import './App.css';
import ErrorBanner from "./component/ErrorBanner";
import { TaskProvider } from "./context/TaskContext";
import { ErrorProvider, ErrorContext } from './context/ErrorContext';
import { registerErrorNotifier } from './utils/errorNotifier';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

//   console.log('ErrorContextModule:', ErrorContextModule);
//  console.log('ErrorBanner:', ErrorBanner);
// console.log('TodoApp:', TodoApp);
// console.log('TaskProvider:', TaskProvider);
// console.log('ErrorProvider:', ErrorProvider);
  return (
    <ErrorProvider>
    <TaskProvider>
      <div className="App">
         <ToastContainer position="top-center" autoClose={3000} />
        <AppContent />
        <TodoApp />
      </div>
    </TaskProvider>
    </ErrorProvider>

  );
}


export default App;
