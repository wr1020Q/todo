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
    <div className="bg-gray-100 min-h-screen animate-slideDown">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-4 h-[85vh]">
           <div className="flex-1 overflow-y-auto mb-4">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="w-full"
          />
          </div>

          <h3 className="text-lg font-semibold mt-4">
            {selectedDate.toDateString()} の Task
          </h3>

          <ul className="list-disc pl-5 mt-2">
            {filteredtasks.map((task) => (
            <li key={task._id}>{task.text}</li>
            ))}
          </ul>
         </div>
      </div>
    </div>
 </>
  );
};

export default CalendarTodo;