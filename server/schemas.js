import Joi from 'joi';

//タスク追加バリデーション
export const tasksSchema = Joi.object({
  text: Joi.string().trim().min(1).max(20).required().messages({
    'string.empty': 'タスク内容は必須です',
    'string.min': 'タスク内容は1文字以上で入力してください',
    'string.max': 'タスク内容は20文字以内で入力してください',
  }),
  completed: Joi.boolean().default(false),
  priority: Joi.number().valid(1, 2, 3).required().messages({
    'any.only': '優先度は1〜3で選んでください',
    'number.base': '優先度は数字で指定してください',
  }),
  category: Joi.string().required().messages({
    'any.required': 'カテゴリは必須です',
  }),
  dueDate: Joi.date().optional(),
});

// タスク更新バリデーション
export const partialTaskSchema = Joi.object({
  text: Joi.string().min(1).max(20),
  completed: Joi.boolean(),
  priority: Joi.number().valid(1, 2, 3),
  category: Joi.string(), 
  dueDate: Joi.date().iso(),
}).min(1); 

//カテゴリー追加・更新バリデーション
export const categorySchema = Joi.object({
  title: Joi.string().trim().min(1).max(20).required().messages({
    'string.empty': 'カテゴリ名は必須です',
    'string.min': 'カテゴリー名は1文字以上で入力してください',
    'string.max': 'カテゴリー名は20文字以内で入力してください',
  }),
});



  