import logo from './logo.svg';
import './App.css';
import { TaskProvider } from "./context/TaskContext";
import React, { useReducer } from "react";

import TodoApp from "./TodoApp";

function App() {
 
  return (
    <TaskProvider>
      <div className="App">
        <TodoApp />
      </div>
    </TaskProvider>

  );
}


export default App;
