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
    category: '684037cb63a9c5c010dc3fc9',     // ← ここがカテゴリと紐づく
    dueDate: new Date('2025-06-01')
  },
  {
    text: '掃除する',
    completed: false,
    priority: 1,
    category: '684037cb63a9c5c010dc3fca',     // ← ここも
    dueDate: new Date('2025-05-28')
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



