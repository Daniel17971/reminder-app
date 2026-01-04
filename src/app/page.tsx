"use client";

import { useState } from "react";
import { Reminder } from "@/types/reminder";
import AddReminderModal from "@/components/AddReminderModal";
import ReminderList from "@/components/ReminderList";

export default function Home() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddReminder = (reminderData: Omit<Reminder, "id">) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setReminders([...reminders, newReminder]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Reminder App
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Keep track of your important events and reminders
          </p>
        </div>

        <ReminderList reminders={reminders} onDelete={handleDeleteReminder} />

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition-all hover:scale-110 hover:bg-zinc-800 active:scale-95 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          aria-label="Add new reminder"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        <AddReminderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddReminder}
        />
      </main>
    </div>
  );
}
