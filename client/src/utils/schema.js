
import * as Yup from 'yup';

//タスク追加
export const addTaskSchema = Yup.object({
  text: Yup.string()
    .min(1, '1文字以上で入力してください')
    .max(20, '20文字以内で入力してください')
    .required('タスク内容は必須です'),
  completed: Yup.boolean().default(false),
  priority: Yup.number().oneOf([1, 2, 3], '優先度は高, 中, 低のいずれかでなければなりません').required('優先度は必須です'),
  category: Yup.string().required('カテゴリーは必須です'),
  dueDate: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError('期限を選んでください')
    .required('期限を選んでください'),
});

//カテゴリー追加
export const addCategorySchema = Yup.object({
  title: Yup.string()
    .min(1, "1文字以上で入力してください")
    .max(20, '20文字以内で入力してください')
    .required('カテゴリー名は必須です')
});

//タスク更新
export const updateTaskSchema = Yup.object().shape({
  text: Yup.string()
    .trim() 
    .min(1, "1文字以上で入力してください")
    .max(20, '20文字以内で入力してください')
    .required("タスクのタイトルは必須です"),
});

//完了状態更新
export const updateCompletedSchema = Yup.object().shape({
  completed: Yup.boolean().default(false),
})

//優先度更新
export const updatePrioritySchema = Yup.object().shape({
  priority: Yup.number().oneOf([1, 2, 3], '優先度は高, 中, 低のいずれかでなければなりません').required('優先度は必須です'),
});

//期限更新
export const updateDueDateSchema = Yup.object().shape({
    dueDate: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError('期限を選んでください')
    .required('期限を選んでください'),
});

//ログイン
export const loginSchema = Yup.object({
  email: Yup.string().email('正しいメールアドレスを入力してください').required('メールアドレスは必須です'),
  password: Yup.string().min(6, '6文字以上で入力してください').required('パスワードは必須です'),
}).required();

//新規登録
export const registerSchema = Yup.object({
  user: Yup.string().required('ユーザー名は必須です'),
  email: Yup.string().email('正しいメールアドレスを入力してください').required('メールアドレスは必須です'),
  password: Yup.string().min(6, '6文字以上で入力してください').required('パスワードは必須です'),
}).required();


