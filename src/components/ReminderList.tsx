"use client";

import { Reminder } from "@/types/reminder";

interface ReminderListProps {
  reminders: Reminder[];
  onDelete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  hasFilters?: boolean;
}

export default function ReminderList({
  reminders,
  onDelete,
  onEdit,
  hasFilters = false,
}: ReminderListProps) {
  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-6xl">📅</div>
        <h3 className="mb-2 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          {hasFilters ? "No reminders match your filters" : "No reminders yet"}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400">
          {hasFilters
            ? "Try adjusting your search or filter criteria"
            : "Click the + button to add your first reminder"}
        </p>
      </div>
    );
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    const dateStr = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timeStr = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { dateStr, timeStr };
  };

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => {
        const { dateStr, timeStr } = formatDateTime(reminder.date, reminder.time);
        return (
          <div
            key={reminder.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {reminder.title}
                  </h3>
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                    {reminder.category}
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {reminder.reminderCategory}
                  </span>
                </div>
                {reminder.description && (
                  <p className="mb-3 text-zinc-600 dark:text-zinc-400">
                    {reminder.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span>📅</span>
                    {dateStr}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🕐</span>
                    {timeStr}
                  </span>
                  {reminder.recurring && (
                    <span className="flex items-center gap-1">
                      <span>🔄</span>
                      Repeats: {reminder.recurring}
                    </span>
                  )}
                </div>
                {reminder.advanceReminders && reminder.advanceReminders.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Advance reminders:
                    </span>
                    {reminder.advanceReminders.map((advReminder, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        {advReminder.amount} {advReminder.unit} before
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => onEdit(reminder)}
                  className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-700"
                  aria-label="Edit reminder"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(reminder.id)}
                  className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-700"
                  aria-label="Delete reminder"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

