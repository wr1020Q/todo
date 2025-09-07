import { TaskContext } from "../context/TaskContext";
import { useContext } from "react";
import { Trash2} from "lucide-react";
import { useAuth } from '../context/AuthContext';


export default function CategoriesList({ categories, }) {
  const { state,removeCategory } = useContext(TaskContext);
  const { categoryFilter} = state;
  const { user  } = useAuth();
  

  console.log('現在のcategoryFilter,INPUT:', categoryFilter); 
  console.log('現在のcategories,INPUT:', categories);

  const options = categories.map(cat => ({
    value: cat._id,
    label: cat.title,
    user: cat.user
  }));


  return (
    <>
    <div className="flex flex-wrap gap-2  mt-2">
      {options.map((cat) => (
        cat.title !== "未分類" && (!user || cat.user === user.id) ? (
      <div key={cat.value} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
        {cat.label}
      <button onClick={() => removeCategory(cat.value, cat.label)} className="text-red-500 hover:text-red-700">
        <Trash2 size={14} />
      </button>
    </div>
      ) : null
  ))}

</div>
</>          
  );
};