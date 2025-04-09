import React from "react";

export default function CategoryInput({ newCategory, setNewCategory, addCategory }) {
    return (
        <div className="mt-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 rounded mr-2"
          placeholder="新しいカテゴリ名"
        />
        <button onClick={addCategory} className="bg-blue-500 text-white p-2 rounded">
          カテゴリ追加
        </button>
      </div>
   
    )
}