import { toast } from 'react-toastify';

// 成功メッセージ
export const showSuccess = (msg) => {
  toast.success(msg);
};

// エラーメッセージ
export const showError = (msg) => {
  toast.error(msg);
};
