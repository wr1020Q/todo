import React from "react";

export default function TaskInput({ 
  task, 
  setTask, 
  priority, 
  handlePriorityChange, 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  addTask ,
  dueDate,
  setDueDate,  
  handleCheckboxChange,
  categoryFilter
}) {
  console.log('現在のcategoryFilter,INPUT:', categoryFilter); 
  return (
    <div className="flex mb-4">
      <input 
        type="text" 
        value={task} 
        onChange={(e) => setTask(e.target.value)}
        className="border p-2 flex-grow rounded-l"
        placeholder="タスクを入力..."
      />
      <select 
        value={priority ?? ""} 
        onChange={handlePriorityChange} 
        className="border p-2 rounded"
      >
        <option value="高">高</option>
        <option value="中">中</option>
        <option value="低">低</option>
      </select>
      <select 
        value={selectedCategory ?? ""} 
        onChange={(e) => setSelectedCategory(e.target.value)} 
        className="border p-2 rounded"
      >
          {(categories ?? []).length === 0 ? (
            <option value="">カテゴリなし</option>
        ) : (
            (categories ?? []).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
        ))
        )}
      </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 rounded"
        />
      <button onClick={()=>addTask(task, priority, selectedCategory,dueDate)} className="bg-blue-500 text-white p-2 rounded-r">
        追加
      </button>
      <p>カテゴリーで絞り込み：</p>
          {categories.map((category) => (
            <label key={category} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={categoryFilter.includes(category)}
              onChange={() => handleCheckboxChange(category)}
            />
              {category}
            </label>
          ))}
    </div>
  );
}
