"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({ 
  id, 
  name, 
  deleteAction 
}: { 
  id: number; 
  name: string; 
  deleteAction: (id: number) => Promise<void>;
}) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      `⚠️ Kya aap sure hain?\n\n"${name}" ko permanently delete kar diya jayega.\n\nYeh action undo nahi hoga.`
    );
    if (!confirmed) return;

    await deleteAction(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 font-bold bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors text-xs"
    >
      Delete
    </button>
  );
}

export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-blue-600 hover:text-blue-900 font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors text-xs"
    >
      Edit
    </button>
  );
}
