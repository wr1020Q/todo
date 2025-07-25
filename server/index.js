import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path'
import { fileURLToPath } from 'url';
import { success, error ,wrapperAsync} from './utils/responseWrapper.js';
import { tasksSchema ,partialTaskSchema} from './schemas.js';
import ExpressError from './utils/expressError.js';
import {Task} from './models/taskschema.js'; 
import {Category} from './models/categoryschema.js'; 
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js'
import { verifyToken } from "./middleware/verifyToken.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from'express-mongo-sanitize';
import xssClean from 'xss-clean';


dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;

;
app.use(express.json());
app.use(cors({
  origin: URL, 
  credentials: true,               
}));
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cookieParser());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    }
  },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'no-referrer-when-downgrade' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
app.use(mongoSanitize());
app.use(xssClean());

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

//タスク追加バリデーション
const validateTask = (req, res, next) => {
    const { error } = tasksSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//タスク更新バリデーション
const validateUpdateTask = (req, res, next) => {
    const { error } = partialTaskSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.use('/api/categories', categoryRoutes);
app.use("/api/auth", authRoutes);

app.get('/',(req,res)=>{
    res.send('hello world')
});

//初期データ取得
app.get('/api/tasks', verifyToken , async (req, res) => {
  try {
    console.log("認証ユーザー:", req.user);
    const tasks = await Task.find({ user: req.user.id }).populate('category');
    // console.log("GET:", tasks);
    success(res, tasks, 'タスク一覧を取得しました');
  } catch (error) {
    console.error('サーバーエラー:', error);
    res.status(500).json({ message: 'サーバーでエラーが発生しました。' });
  }
});

//追加
  app.post('/api/tasks', verifyToken , validateTask,async (req, res) => {
  try {
    const { text, priority, category, dueDate } = req.body;

    const categoryDoc = await Category.findById(category); // ← category は ID の文字列
    const categoryId = categoryDoc ? categoryDoc._id : (await Category.findOne({ title: '未分類' }))?._id;

    const task = new Task({
      text,
      priority,
      category: categoryId, 
      dueDate,
      user: req.user.id,
    });

    await task.save();
    const populatedTask = await Task.findById(task._id).populate('category');
    success(res,populatedTask,'新しいタスクを作成しました')
  } catch (err) {
    return error(res, 'タスク作成失敗', 500);
  }
});

//更新
app.patch('/api/tasks/:id', verifyToken , validateUpdateTask,async (req, res) => {
  try {

    const updated = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) {
      return error(res, '更新対象のタスクが見つかりません。', 500);
    }
    
    // console.log(updated,'タスクを更新しました')
    success(res,updated,'タスクを更新しました')
  } catch (err) {
    return error(res, 'タスク更新失敗', 500);
  }
});

//削除
app.delete('/api/tasks/:id',  verifyToken , async (req, res) => {
  try {
    await Task.findByIdAndDelete({_id:req.params.id , user:req.user.id,});
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