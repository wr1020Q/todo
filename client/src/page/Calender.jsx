import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useContext } from "react"
import { TaskContext } from "../context/TaskContext";


const CalendarTodo = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { state} = useContext(TaskContext);
  const { tasks } = state;

  console.log("CalendarTodo")
  const filteredtasks = Array.isArray(tasks)
  ?  tasks.filter(task =>
    new Date(task.dueDate).toDateString() === selectedDate.toDateString()
    
  ): [];

  console.log("カレンダーfilteredtasks:",filteredtasks)

  return (
    <div>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
      />

      <h3>{selectedDate.toDateString()} のTask</h3>
      <ul>
        {filteredtasks.map(task => (
          <li key={task.id}>{task.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarTodo;