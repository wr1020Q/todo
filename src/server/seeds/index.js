const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path')

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  priority: Number,
  category: String,
  dueDate: String
});

const Task = mongoose.model('Task', taskSchema);

mongoose.connect('mongodb://localhost:27017/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const seedTasks = [
    {
      text: '勉強する',
      completed: false,
      priority: 1,
      category: '勉強',
      dueDate: '2025-05-10',
    },
    {
      text: '掃除する',
      completed: true,
      priority: 2,
      category: '家事',
      dueDate: '2025-05-08',
    },
    {
      text: '買い物に行く',
      completed: false,
      priority: 3,
      category: '生活',
      dueDate: '2025-05-09',
    }
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



