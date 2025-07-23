import express from "express";
import cors from 'cors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { success, error, wrapperAsync } from '../utils/responseWrapper.js';
import User from '../models/User.js'; 
import cookieParser from"cookie-parser";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
router.use(cors({
  origin: 'http://localhost:5000',  // フロントのURLを明示的に指定
  credentials: true,                // Cookieの送受信を許可
}));
router.use(express.json());
router.use(cookieParser());

const users = []; // テスト用（本番はDB）

// 新規登録
router.post("/register", async (req, res) => {
  try{
      const { user,email, password } = req.body;
      const hashed = await bcrypt.hash(password, 10);

      // すでに存在してるか確認
      const existingUser = await User.findOne({ user });
      if (existingUser) {
        return res.status(400).json({ message: "このユーザーは既に登録されています" });
      }

      //DBにユーザーを保存
      const userData = new User({ user, email,password: hashed });
      await userData.save();

      // JWT作成
      const token = jwt.sign({ id: userData._id, email: userData.email, user: userData.user }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // JWTをHttpOnly Cookieにセット
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production", // 本番では true
        maxAge: 1000 * 60 * 60 * 24,
        Path:"/" 
      });

      return res.status(201).json({ message: "登録成功", user: { email: user.email } });
  } catch (err) {
      console.error("新規登録に失敗:サーバーエラー", err); 
      return error(res, '新規登録に失敗しました', 500);
  }
});

//ログイン
router.post("/login", async (req, res) => {
  try{
      const { user, password } = req.body;

      const userData = await User.findOne({ user });
      if (!userData) return error(res, 'ユーザーが違います', 401);
  
      const match = await bcrypt.compare(password, userData.password);
      if (!match) return error(res, 'パスワードが違います', 401);

      //JWT発行
      const token = jwt.sign({ id: userData._id, email: userData.email, user: userData.user }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const refreshToken = jwt.sign({ id: userData._id, email: userData.email, user: userData.user }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
      // クッキーにトークンを保存
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // 本番のみHTTPS
        sameSite: "Lax",
        maxAge: 1000 * 60 * 60 * 24, // 1日
        Path:"/" 
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,// 7日
        Path:"/" 
      });

      return res.status(200).json({ user: { id: userData._id, email: userData.email, user: userData.user } });
  } catch (err) {
      console.error("ログイン失敗:サーバーエラー", err); 
      return error(res, 'ログインに失敗しました', 500);
  }
});

router.get('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'リフレッシュトークンがありません' });
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    // 新しいアクセストークン発行
    const accessToken = jwt.sign({ id: payload.id, email: payload.email, user: payload.user }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', accessToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
      Path:"/" 
    });

    return res.status(200).json({ user: { id: payload.id, email: payload.email, user: payload.user } }); // 必要に応じてユーザー情報も入れてOK
  } catch (err) {
    return res.status(401).json({ message: '無効なリフレッシュトークン' });
  }
});

//ログアウト
router.post("/logout", (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: false,// 本番のみHTTPS
    sameSite: "Lax",
    Path:"/" 
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,// 本番のみHTTPS
    sameSite: "Lax",
    Path:"/" 
  });
  res.json({ message: "ログアウトしました" });
});

export default router;
