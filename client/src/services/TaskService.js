import apiClient from './apiClient';

//タスク一覧取得
export const getTasksAPI = async () => {
try {
    const res = await apiClient.get('/tasks');
    return res.data;
  } catch (err) {
    console.error('タスク取得エラー:', err);
    throw err;
  }
};

//タスク追加
export const addTaskAPI = async (taskDate) => {
  try {
    console.log("addTask",taskDate);
    const res = await apiClient.post('/tasks', taskDate);
    return res.data;
  } catch (err) {
    console.error('タスク追加エラー:', err);
    throw err;
  }
};

//タスク更新
export const updateTaskAPI = async (id, updatedData) => {
  try {
    console.log("updateTaskAPI",updatedData);
    await apiClient.patch(`/tasks/${id}`, updatedData);
  } catch (err) {
    console.error('タスク更新エラー:', err);
    throw err;
  }
};

//タスク削除
export const deleteTaskAPI = async (id) => {
  try {
    await apiClient.delete(`/tasks/${id}`);
  } catch (err) {
    console.error('タスク削除エラー:', err);
    throw err;
  }
  
};

//カテゴリー
//カテゴリー一覧取得
export const getCategoriesAPI = async () => {
try {
    const res = await apiClient.get('/categories');
    return res.data;
  } catch (err) {
    console.error('カテゴリー取得エラー:', err);
    throw err;
  }
};

//カテゴリー追加
export const addCategoryAPI = async (title) => {
try {
  console.log("addCategoryAPI",title)
    const res = await apiClient.post('/categories', { category: title });
    return res.data;
  } catch (err) {
    console.error('カテゴリー追加エラー:', err);
    throw err;
  }
};

//カテゴリー更新
export const updateCategoryAPI = async (id, updatedData) => {
try {
    const res = await apiClient.put(`/categories/${id}`, {title : updatedData});
    return res.data;
  } catch (err) {
    console.error('カテゴリー更新エラー:', err);
    throw err;
  }
};

//カテゴリー削除
export const deleteCategoryAPI = async (id) => {
  try {
    await apiClient.delete(`/categories/${id}`);
  } catch (err) {
    console.error('カテゴリー削除エラー:', err);
    throw err;
  }
  
};