import apiClient from './apiClient';

export const getTasks = async () => {
try {
    const res = await apiClient.get('/tasks');
    return res.data;
  } catch (err) {
    console.error('タスク取得エラー:', err);
    throw err;
  }
};

export const addTask = async (taskDate) => {
  try {
    console.log("addTask",taskDate);
    const res = await apiClient.post('/tasks', taskDate);
    return res.data;
  } catch (err) {
    console.error('タスク追加エラー:', err);
    throw err;
  }
};

export const updateTaskAPI = async (id, updatedData) => {
  try {
    console.log("updateTaskAPI",updatedData);
    await apiClient.patch(`/tasks/${id}`, updatedData);
  } catch (err) {
    console.error('タスク更新エラー:', err);
    throw err;
  }
};

export const deleteTaskAPI = async (id) => {
  try {
    await apiClient.delete(`/tasks/${id}`);
  } catch (err) {
    console.error('タスク削除エラー:', err);
    throw err;
  }
  
};

//カテゴリー
export const getCategories = async () => {
try {
    const res = await apiClient.get('/categories');
    return res.data;
  } catch (err) {
    console.error('カテゴリー取得エラー:', err);
    throw err;
  }
};

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

export const updateCategory = async (id, updatedData) => {
try {
    await apiClient.put(`/categories/${id}`, updatedData);
  } catch (err) {
    console.error('カテゴリー更新エラー:', err);
    throw err;
  }
};

export const deleteCategory = async (id) => {
  try {
    await apiClient.delete(`/categories/${id}`);
  } catch (err) {
    console.error('カテゴリー削除エラー:', err);
    throw err;
  }
  
};