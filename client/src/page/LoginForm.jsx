import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/schema';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {showError, showSuccess} from '../utils/toast';
import { loginUser } from '../services/login';
import Navbar from "../component/Navbar";


const  LoginForm = () => {
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  //ログイン情報を送信
  const onSubmit = async (data) => {
    try {
      console.log("送信データ", data);
      setServerError("")
      const res = await loginUser(data);
      if (!res || !res.user) {
        throw new Error("レスポンスにユーザーデータが含まれていません");
      }
      const user = res.user;
      console.log("ログインデータ", res);
      setUser(user);
      navigate("/")
      showSuccess(`おかえりなさい！ ${user.user}さん`)

    } catch (error) {
        console.log('キャッチしたエラー', error);
    if (error.response) {
      console.log('レスポンスデータ', error.response.data);
    }
        const message = error.response?.data?.message || "ログインに失敗しました";
        setServerError(message);
    }
  };

 const onError = (errors) => console.log(errors);
  return (
    <>
    <Navbar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit,onError)}>
        <div className="mb-4">
          {serverError && <p className="text-red-500 text-xs italic">{serverError}</p>}
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            メールアドレス
          </label>
          <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email || serverError ? 'border-red-500' : ''}`} id="username" type="text" placeholder="ユーザー名"
            {...register("email")}
            />
            <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード
          </label>
          <input className={`shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline ${errors.password || serverError ? 'border-red-500' : ''}`}  id="password" type="password" placeholder="パスワード"
            {...register("password")}
            />
            <p className="text-red-500 text-xs italic">{errors.password?.message}</p>
        </div>
        <div className="flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            ログイン
          </button>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2020 Acme Corp. All rights reserved.
      </p>
    </div>
    </div>
  </>   
  );
};

export default LoginForm;
