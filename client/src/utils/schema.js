import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

//タスク追加
export const addTaskSchema = Yup.object({
  text: Yup.string().required('タイトルは必須です'),
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
  title: Yup.string().required('カテゴリー名は必須です')
});

//タスク更新
export const updateTaskSchema = Yup.object().shape({
  text: Yup.string().required('タスクのタイトルは必須です')
});

export const updateCompletedSchema = Yup.object().shape({
  completed: Yup.boolean().default(false),
})

export const updatePrioritySchema = Yup.object().shape({
  priority: Yup.number().oneOf([1, 2, 3], '優先度は高, 中, 低のいずれかでなければなりません').required('優先度は必須です'),
});

export const updateDueDateSchema = Yup.object().shape({
    dueDate: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError('期限を選んでください')
    .required('期限を選んでください'),
});


