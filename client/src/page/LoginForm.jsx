import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/schema';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {showError, showSuccess} from '../utils/toast';
import { loginUser } from '../services/login';


const  LoginForm = () => {
  const { setUser } = useAuth();
  const [passwordError, setPasswordError] = useState('');
  const [userError, setUserError] = useState('');

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  //ログイン情報を送信
  const onSubmit = async (data) => {
    try {
      setUserError("")
      setPasswordError("")
      const res = await loginUser(data);
      const user = res.user;
      console.log("ログインデータ", res);
      setUser(user);

      navigate("/")
      showSuccess(`おかえりなさい！ ${user.user}さん`)

    } catch (error) {
      const message = error.response?.data?.message;
      console.error("ログイン失敗:", message);

      if (message === 'ユーザーが違います') {
        setUserError(message);
      } else if (message === 'パスワードが違います') {
        setPasswordError(message);
      }else{
        showError(message || "ログインに失敗しました");
      }
    }
  };

 const onError = (errors) => console.log(errors);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit,onError)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            ユーザー名
          </label>
          <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.user || userError ? 'border-red-500' : ''}`} id="username" type="text" placeholder="ユーザー名"
            {...register("user")}
            />
            {userError && <p className="text-red-500 text-xs italic">{userError}</p>}
            <p className="text-red-500 text-xs italic">{errors.user?.message}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード
          </label>
          <input className={`shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline ${errors.password || passwordError ? 'border-red-500' : ''}`}  id="password" type="password" placeholder="パスワード"
            {...register("password")}
            />
            {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
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
  );
};

export default LoginForm;
