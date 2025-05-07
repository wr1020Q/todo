const mongoose = require('mongoose');
const { Schema,model } = mongoose;

const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  priority: Number,
  category: String,
  dueDate: String
});

module.exports = mongoose.model('Task', taskSchema);