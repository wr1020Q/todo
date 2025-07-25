import apiClient from './apiClient';

//新規登録
export const registerUser = async (registerData) => {
  try {
    const res = await apiClient.post("/auth/register", registerData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

//ログイン
export const loginUser = async (loginData) => {
  try {
    const res = await apiClient.post("/auth/login", loginData);
    return res.data;
  } catch (err) {
    console.log("ログインエラーAXIO")
    console.log("ログインエラーF",err)
    throw err;
  }
};

//ページリロード
export const refreshUser = async () => {
  try {
    const res = await apiClient.get("/auth/refresh");
    return res.data;
  } catch (err) {
    console.error('リフレッシュエラー:', err);
    throw err;
  }
};

//ログアウト
export const logoutUser = async () => {
  try {
    const res = await apiClient.post("/auth/logout");
    return res.data;
  } catch (err) {
    throw err;
  }
};
