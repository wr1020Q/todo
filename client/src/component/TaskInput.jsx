import { TaskContext } from "../context/TaskContext";
import { useContext } from "react";
import Select from 'react-select';
import { Filter } from "lucide-react";

export default function TaskInput({ categories, }) {
  const { state, dispatch } = useContext(TaskContext);
  const { categoryFilter} = state;

  console.log('現在のcategoryFilter,TASKINPUT:', categoryFilter); 
  console.log('現在のcategories,TASKINPUT:', categories);

  const options = categories.map(cat => ({
    value: cat._id,
    label: cat.title,
    user: cat.user
  }));


  return (
    <>
    <div >
      <Select
        isMulti
        isSearchable={false}
        options={options}
        value={options.filter(option => categoryFilter.includes(option.value))}
        onChange={(selected) => {dispatch({type: "SET_CATEGORY_FILTER",payload: selected ? selected.map(opt => opt.value) : []});}}
        className="w-64 text-sm"
        placeholder={
          <div className="flex items-center gap-2 text-gray-500 fadeSlideRight">
            <Filter size={16} />
            <span>カテゴリで絞り込み</span>
          </div>
        }
      />
    </div>
</>          
  );
};
