import { useEffect ,useContext } from "react";
import './App.css';
import ErrorBanner from "./component/ErrorBanner";
import { TaskProvider } from "./context/TaskContext";
import { ErrorProvider, ErrorContext } from './context/ErrorContext';
import { registerErrorNotifier } from './utils/errorNotifier';
import * as ErrorContextModule from './context/ErrorContext';


import TodoApp from "./TodoApp";

const AppContent = () => {
  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    registerErrorNotifier(setError); // Axios→React 連携
  }, [setError]);

  return (
    <>
      <ErrorBanner />
    </>
  );
};
function App() {
  console.log('ErrorContextModule:', ErrorContextModule);
 console.log('ErrorBanner:', ErrorBanner);
console.log('TodoApp:', TodoApp);
console.log('TaskProvider:', TaskProvider);
console.log('ErrorProvider:', ErrorProvider);
  return (
    <ErrorProvider>
    <TaskProvider>
      <div className="App">
        <AppContent />
        <TodoApp />
      </div>
    </TaskProvider>
    </ErrorProvider>

  );
}


export default App;
