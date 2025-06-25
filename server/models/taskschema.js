const mongoose = require('mongoose');
const { Schema,model,models} = mongoose;


const taskSchema = new mongoose.Schema({
  text:  { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  priority:  { type: Number, enum: [1, 2, 3], default: 2 },
  category:  {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
  required: true,
  validate: {
    validator: async function (id) {
      const exists = await mongoose.model('Category').exists({ _id: id });
      return !!exists;
    },
    message: '指定されたカテゴリが存在しません'
  }
},
  dueDate: Date
});


const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
module.exports = { Task };