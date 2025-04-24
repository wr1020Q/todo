const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

mongoose.connect('mongodb://localhost:27017/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB に接続成功！'))
.catch((err) => console.error('接続エラー:', err));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.get('/',(req,res)=>{
    res.send('hello world')
});

app.get('/api/tasks', (req, res) => {
    const tasks = [
      { id: 1, text: "サンプルタスク", completed: false ,priority:2,category:"勉強",dueDate:"2025/04/12"},
      { id: 2, text: "Nodeと連携する", completed: true ,priority:1,category:"家事",dueDate:"2025/04/13"}
    ];
    res.json(tasks);
  });

app.listen(PORT, () => {
    console.log(`${PORT}で待ち受け中`)
});