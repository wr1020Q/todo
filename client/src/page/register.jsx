import { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../utils/schema';

const  Register = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
      register,
      handleSubmit,
      formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });
  
  const onSubmit = (data) => {
   try {
    
    console.log("ログインデータ", data);

  } catch (error) {
    console.error("ログイン失敗:", error.message);
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
            // value={user}
            // onChange={(e) => setUser(e.target.value)}
          />
          <p className="text-red-500 text-xs italic">{errors.user?.message}</p>
        </div>
            <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            メールアドレス
          </label>
          <input className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`} id="email" type="text" placeholder="メールアドレス"
            {...register("email")}
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード
          </label>
          <input className={`"shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" ${errors.password ? 'border-red-500' : ''}`} id="password" type="password" placeholder="パスワード"
            {...register("password")}
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
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