import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/calendar">カレンダー</Link>
      <Link to="/login">ログイン</Link>
      <Link to="/register">新規登録</Link>
    </nav>
  );
}
