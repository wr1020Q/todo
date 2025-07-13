import apiClient from './apiClient';

export const login = async (email, password) => {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("ログイン失敗");
  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
};
