const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path')
const { success, error ,wrapperAsync} = require('./utils/responseWrapper');
const { tasksSchema ,categoriesSchema} = require('../schemas');
const ExpressError = require('./utils/expressError');
const {Task} = require('./models/taskschema'); 
const {Category} = require('./models/categoryschema'); 
const categoryRoutes = require('./routes/categories');
const { title } = require('process');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));

mongoose.connect('mongodb://localhost:27017/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB に接続成功！'))
.catch((err) => console.error('接続エラー:', err));

const init = async () => {
  try {
    const exists = await Category.findOne({ title: '未分類' });
    if (!exists) {
      await Category.create({ 
        title: '未分類' });
      console.log('✅ 未分類カテゴリを作成しました');
    } else {
      console.log('ℹ️ 未分類カテゴリは既に存在しています');
    }
  } catch (err) {
    console.error('❌ 初期化失敗:', err);
  } finally {
    // mongoose.connection.close();
  }
};

init();

//エラー処理
const errorHandler = (err, req, res, next) => {
  console.error('🔥 エラー発生:', err.message);

  const status = err.statusCode || 500;
  const message = err.message || 'サーバーエラー';

  return error(res, message, status);
};

const validateTask = (req, res, next) => {
    const { error } = tasksSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.use('/api/categories', categoryRoutes);

app.get('/',(req,res)=>{
    res.send('hello world')
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('category');
    console.log("GET:", tasks);
    success(res, tasks, 'タスク一覧を取得しました');
  } catch (error) {
    console.error('サーバーエラー:', error);
    res.status(500).json({ message: 'サーバーでエラーが発生しました。' });
  }
});

  app.post('/api/tasks', validateTask,async (req, res) => {
  try {
    const { text, priority, category, dueDate } = req.body;

    const categoryDoc = await Category.findById(category); // ← category は ID の文字列
    const categoryId = categoryDoc ? categoryDoc._id : (await Category.findOne({ title: '未分類' }))?._id;

    const task = new Task({
      text,
      priority,
      category: categoryId, 
      dueDate
    });

    await task.save();
    const populatedTask = await Task.findById(task._id).populate('category');
    success(res,populatedTask,'新しいタスクを作成しました')
  } catch (err) {
    return error(res, 'タスク作成失敗', 500);
  }
});

app.patch('/api/tasks/:id',async (req, res) => {
  try {

    const updated = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) {
      return error(res, '更新対象のタスクが見つかりません。', 500);
    }
    
    console.log(updated,'タスクを更新しました')
    success(res,updated,'タスクを更新しました')
  } catch (err) {
    return error(res, 'タスク更新失敗', 500);
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: '削除成功' });
  } catch (err) {
    return error(res, '削除失敗', 500);
  }
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.all('*', (req, res, next) => {
    next(new ExpressError('ページが見つかりませんでした', 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`${PORT}で待ち受け中`)
});