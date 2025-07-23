const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path')
const { model, models, Schema } = mongoose;
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const taskSchema = new Schema({
  text: String,
  completed: Boolean,
  priority: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  dueDate: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
});

const Task = mongoose.model('Task', taskSchema);

mongoose.connect('mongodb://localhost:27017/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const seedTasks = [
  {
    text: 'レポートを提出',
    completed: false,
    priority: 2,
    category: '687d96f2b63c3d1b8665d98e',    
    dueDate: new Date('2025-06-01'),
    user:'687c5d3ed581bbeb9498b939'
  },
  {
    text: '掃除する',
    completed: false,
    priority: 1,
    category: '687d96f2b63c3d1b8665d98f',  
    dueDate: new Date('2025-05-28'),
    user:'687c5d3ed581bbeb9498b939'
  },
];
  
  async function seedDB() {
    await Task.deleteMany({});
    await Task.insertMany(seedTasks);
    console.log('✅ テストデータを挿入しました');
    mongoose.connection.close();
  }
  
  seedDB().catch((err) => {
    console.error('❌ シードエラー:', err);
    mongoose.connection.close();
  });



