
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../utils/schema';
import { registerUser } from '../services/login';
import { showError , showSuccess } from '../utils/toast';
import { useNavigate } from 'react-router-dom';

const  Register = () => {
  
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const {
      register,
      handleSubmit,
      formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });
  
  const onSubmit = async (data) => {
   try {
      const res = await registerUser(data);
      console.log("登録データ", data);
      showSuccess("ユーザーの登録をしました")
      setServerError("")
      navigate('/login');
    } catch (error) {
      console.error("登録失敗:", error.message);
      if (error.response?.data?.message) {
        setServerError(error.response.data.message); // サーバーからのエラーメッセージ
      }
      showError("ユーザーの登録に失敗しました")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            ユーザー名
          </label>
          <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.user ? 'border-red-500' : ''}`} id="username" type="text" placeholder="ユーザー名"
            {...register("user")}
          />
          {serverError && (<p className="text-red-500 text-xs mt-2 italic">{serverError}</p>)}
          <p className="text-red-500 text-xs italic">{errors.user?.message}</p>
        </div>
            <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            メールアドレス
          </label>
          <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`} id="email" type="text" placeholder="メールアドレス"
            {...register("email")}
          />
          <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード
          </label>
          <input className={`shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`} id="password" type="password" placeholder="パスワード"
            {...register("password")}
          />
          <p className="text-red-500 text-xs italic">{errors.password?.message}</p>
        </div>
        <div className="flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            新規登録
          </button>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2020 Acme Corp. All rights reserved.
      </p>
    </div>
    </div>
  );
}

export default Register;