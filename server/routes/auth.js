import express from "express";
import cors from 'cors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { success, error, wrapperAsync } from '../utils/responseWrapper.js';
import {User} from '../models/User.js'; 
import cookieParser from"cookie-parser";
import loginLimiter from"../middleware/loginLimiter.js";
import RefreshToken from '../models/refreshTokenschema.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
router.use(cors({
  origin: process.env.NODE_ENV === 'production'
  ? 'https://yourdomain.com'
  : 'http://localhost:5000',
  credentials: true,                
}));
router.use(express.json());
router.use(cookieParser());

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
      const token = jwt.sign({ id: userData._id ,user: userData.user}, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // JWTをHttpOnly Cookieにセット
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production", // 本番では true
        maxAge: 1000 * 60 * 15,
      });

      return res.status(201).json({ message: "登録成功" });
  } catch (err) {
      console.error("新規登録に失敗:サーバーエラー", err); 
      return error(res, '新規登録に失敗しました', 500);
  }
});

//ログイン
router.post("/login" , loginLimiter , async (req, res) => {
  try{
      const { email, password } = req.body;

      const userData = await User.findOne({ email });
      console.log("userData",userData)
      if (!userData) return error(res, 'メールアドレスかパスワードが違います', 401);
  
      const match = await bcrypt.compare(password, userData.password);
      console.log("match",match)
      if (!match) return error(res, 'メールアドレスかパスワードが違います', 401);

      //JWT発行
      const token = jwt.sign({ id: userData._id , user: userData.user}, process.env.JWT_SECRET, { expiresIn: "1h" });
      const refreshToken = jwt.sign({ id: userData._id , user: userData.user}, process.env.REFRESH_SECRET, { expiresIn: '7d' });

      // DBに保存
      await RefreshToken.create({
        userId: userData._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      // クッキーにトークンを保存
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // 本番のみHTTPS
        sameSite: "Lax",
        maxAge: 1000 * 60 * 15,  
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,// 7日
      });

      return res.status(200).json({ user: { id: userData._id ,user: userData.user} });
  } catch (err) {
      console.error("ログイン失敗:サーバーエラー", err); 
      return error(res, 'ログインに失敗しました', 500);
  }
});

router.get('/refresh', async(req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("refresh",refreshToken)
  if (!refreshToken) {
    return res.status(401).json({ message: '認証できませんでした' });
  }
  try {
    //DBにリフレッシュトークンがあるか
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    console.log("storedToken",storedToken)
    if (!storedToken) return res.status(403).json({ message: '認証できませんでした' });

    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    // 新しいアクセストークン発行
    const accessToken = jwt.sign({ id: payload.id ,user: payload.user  }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', accessToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 15,
    });

    return res.status(200).json({ user: { id: payload.id , user: payload.user } }); 
  } catch (err) {
    return res.status(401).json({ message: '認証できませんでした' });
  }
});

//ログアウト
router.post("/logout", async(req, res) => {

  try{
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',// 本番のみHTTPS
      sameSite: "Lax",
      Path:"/" 
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',// 本番のみHTTPS
      sameSite: "Lax",
      Path:"/" 
    });

    res.json({ message: "ログアウトしました" });

  } catch (err) {
    return res.status(401).json({ message: 'ログアウト失敗' });
  }

});

export default router;
