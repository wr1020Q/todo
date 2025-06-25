// seedCategories.js

const mongoose = require('mongoose');
const { model, models, Schema } = mongoose;

// MongoDB 接続 URL（適宜書き換えてください）
const MONGODB_URI = 'mongodb://localhost:27017/todo-app';

// Category モデル定義
const categorySchema = new Schema({
  title: { type: String, required: true, unique: true }
});

const Category = models.Category || model('Category', categorySchema);

// シードデータ
const categories = [
  { title: '仕事' },
  { title: '家事' },
  { title: '勉強' },
  {title: '健康' },
];

// MongoDB 接続 → データ挿入
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    await Category.deleteMany(); // 既存データを削除（必要に応じて）
    await Category.insertMany(categories);
    console.log('カテゴリーのシードデータを挿入しました。');
  } catch (err) {
    console.error('シードエラー:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
