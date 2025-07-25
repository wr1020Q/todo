import rateLimit from 'express-rate-limit';

// ログイン用のレートリミット設定
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分間
  max: 10,                  // 15分間に最大10回までリクエスト許可
  keyGenerator: (req, res) => {
    return req.ip;  // IPアドレスごとに制限
  },
  message: 'ログイン試行回数が多すぎます。15分後に再度お試しください。',
  standardHeaders: true,    // レスポンスヘッダーに制限情報を追加
  legacyHeaders: false,     // レガシーヘッダー削除
  handler: (req, res) => {
    res.status(429).json({ message: "試行回数が多すぎます。15分後に再試行してください。" });
  },
});

export default loginLimiter;
