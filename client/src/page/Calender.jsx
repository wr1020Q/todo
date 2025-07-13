import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useContext } from "react"
import { TaskContext } from "../context/TaskContext";
import Navbar from "../component/Navbar";

const CalendarTodo = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { state} = useContext(TaskContext);
  const { tasks } = state;


  const filteredtasks = Array.isArray(tasks)
  ?  tasks.filter(task =>
    new Date(task.dueDate).toDateString() === selectedDate.toDateString()
    
  ): [];

  console.log("カレンダーfilteredtasks:",filteredtasks)

  return (
    <>
    <Navbar />
    <div className="flex justify-center">
      <div className="p-4 bg-white shadow rounded-md w-full max-w-md">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />

        <h3 className="text-lg font-semibold mt-4">
          {selectedDate.toDateString()} の Task
        </h3>

        <ul className="list-disc pl-5 mt-2">
          {filteredtasks.map((task) => (
          <li key={task.id}>{task.text}</li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default CalendarTodo;