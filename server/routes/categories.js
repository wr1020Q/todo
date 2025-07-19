const express = require('express');
const cors = require('cors');
const router = express.Router();
const {Category }= require('../models/categoryschema');
const {Task} = require('../models/taskschema');
const { categoriesSchema} = require('../../schemas');
const { success, error ,wrapperAsync} = require('../utils/responseWrapper');

router.use(cors());
router.use(express.json());

//カテゴリー一覧
router.get('/', async (req, res) => {
  const categorys = await Category.find()
  success(res,categorys,'タスク一覧を取得しました')
});

//カテゴリー追加
router.post('/',async (req, res) => {
  try {
    console.log("受信したリクエストボディ:", req.body); 
    const { category } = req.body;
    if (!category) return error(res, 'カテゴリー作成失敗', 500);

    const newCategory = new Category({
      title : category
    });
    await newCategory.save();
    const addcategory = await Category.findById(newCategory._id)
    success(res,addcategory,'新しいカテゴリーを作成しました')
  } catch (err) {
    console.error("カテゴリー作成サーバーエラー:", err); 
    return error(err, 'カテゴリー作成失敗', 500);
  }
});

//カテゴリー更新
router.put('/:id', async (req, res) => {
  try{
      const { id } = req.params;
      const { title } = req.body;
      console.log(id,title,"カテゴリー更新")

      const updated = await Category.findByIdAndUpdate(id, { title }, { new: true });
      console.log("updatedカテゴリー",updated)
      success(res,updated,'カテゴリーを更新')

  } catch (err) {
    console.error("カテゴリー更新サーバーエラー:", err); 
    return error(err, 'カテゴリー更新失敗', 500);
  }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const categoryToDelete = await Category.findById(id);
    if (!categoryToDelete){
        return (res, 'このカテゴリーは存在しません', 400);
    }
 
    if (categoryToDelete.title === "未分類"){
        return error(res, '未分類カテゴリは削除できません', 400);
    }

    const uncategorized = await Category.findOne({ title: "未分類" });
  await Task.updateMany(
    { category: id },
    { $set: { category: uncategorized } }
  );

  await Category.findByIdAndDelete(id);
  

  res.json({ message: 'カテゴリ削除・タスクは未分類に変更済み' });
});

module.exports = router;