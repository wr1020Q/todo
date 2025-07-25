import { createContext, useContext, useState ,useEffect} from 'react';
import { logoutUser , refreshUser} from '../services/login';
import { useNavigate } from 'react-router-dom';
import { showSuccess,showError } from '../utils/toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // マウント時にリフレッシュトークンでログイン状態確認
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await refreshUser(); // リフレッシュAPI
        console.log("リフレッシュ",res);
        setUser(res.user); // 返ってきたユーザー情報をセット
      } catch (err) {
        console.error('リフレッシュエラー AUTH:', err);
        setUser(null);
        await logoutUser();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  //ログアウト
  const logout = async () => {
    try {
        await logoutUser();
        setUser(null); 
        navigate("/login");
        showSuccess(`ログアウトしました`) 
    } catch (err) {
        console.error("ログアウト失敗", err);
        showError("ログアウトに失敗しました")
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout ,loading ,setLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
