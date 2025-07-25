import express from 'express';
import cors from 'cors';
import { Category } from '../models/categoryschema.js';
import { Task } from '../models/taskschema.js';
import { categorySchema } from '../schemas.js';
import { success, error ,wrapperAsync} from '../utils/responseWrapper.js';
import { verifyToken } from "../middleware/verifyToken.js";
import ExpressError from '../utils/expressError.js';

const router = express.Router();
router.use(cors({
  origin: process.env.NODE_ENV === 'production'
  ? 'https://yourdomain.com'
  : 'http://localhost:5000',
  credentials: true,              
}));
router.use(express.json());

//カテゴリーバリデーション
const validateCategory = (req, res, next) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//カテゴリー一覧
router.get('/', verifyToken , async (req, res) => {
    const categories = await Category.find({
      $or: [
        { user: req.user.id },   // 自分のカテゴリ
        { user: null }            // 全体公開カテゴリ（未分類など）
      ]
    });
  success(res,categories,'カテゴリー一覧を取得しました')
});

//カテゴリー追加
router.post('/', verifyToken , validateCategory,async (req, res) => {
  const { category } = req.body;
  console.log(category)
  try {
    const { title } = req.body;
    if (!title) return error(res, 'カテゴリー作成失敗', 500);

    console.log(category)
    const newCategory = new Category({
      title : title,
      user: req.user.id
    });
    await newCategory.save();
    const addcategory = await Category.findById(newCategory._id)
    success(res,addcategory,'新しいカテゴリーを作成しました')
  } catch (err) {
    console.error("カテゴリー作成サーバーエラー:", err); 
    return error(res, 'カテゴリー作成失敗', 500);
  }
});

//カテゴリー更新
router.put('/:id', verifyToken , validateCategory, async (req, res) => {
  try{
      const { id } = req.params;
      const { title } = req.body;
      const userId = req.user.id;
      console.log(id,title,"カテゴリー更新")

      const category = await Category.findById(id);
      if (!category) {
        return error(res, 'カテゴリーが見つかりません', 404);
      }

      // カテゴリーがnull（未分類など）または他人が作ったものなら拒否
      if (!category.user || category.user.toString() !== userId) {
        return error(res, 'このカテゴリーは編集できません', 404);
      }

      const updated = await Category.findByIdAndUpdate(id, { title }, { new: true });

      console.log("updatedカテゴリー",updated)
      success(res,updated,'カテゴリーを更新')

  } catch (err) {
    console.error("カテゴリー更新サーバーエラー:", err); 
    return error(res, 'カテゴリー更新失敗', 500);
  }
});

//カテゴリー削除
router.delete('/:id',  verifyToken , async (req, res) => {
  try{
      const { id } = req.params;
      const userId = req.user.id;

      const categoryToDelete = await Category.findOne({ _id: id, user: req.user.id });
      if (!categoryToDelete){
        return error(res, 'このカテゴリーは存在しません', 400);
      }
 
      if (!categoryToDelete.user || categoryToDelete.user.toString() !== userId) {
        return error(res, 'このカテゴリーは削除できません', 403);
      }

      const uncategorized = await Category.findOne({ title: "未分類" });
      await Task.updateMany(
        { category: id },
        { $set: { category: uncategorized } }
      );

      await Category.findByIdAndDelete(id);
  
      res.json({ message: 'カテゴリ削除・タスクは未分類に変更済み' });
  }catch (err) {
      console.error("カテゴリー削除サーバーエラー:", err); 
      return error(res, 'カテゴリー削除失敗', 500);
  }

});

export default router;