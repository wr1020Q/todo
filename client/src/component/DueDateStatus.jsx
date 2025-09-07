import { useMemo } from "react";

export default function DueDateStatus({ dueDate }) {
  const status = useMemo(() => {
    if (!dueDate) return null;

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "期限切れ", color: "bg-red-200 text-red-800" };
    if (diffDays <= 3) return { text: `あと${diffDays}日`, color: "bg-yellow-200 text-yellow-800" };
    
    return null; // それ以外は表示しない
  }, [dueDate]);

  if (!status) return null;

  return (
    <span
      className={` inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${status.color} select-none`}
      style={{ lineHeight: 1, width: "auto", maxWidth: "fit-content" }}
    >
      {status.text}
    </span>
  );
}

