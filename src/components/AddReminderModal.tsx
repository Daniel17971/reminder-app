"use client";

import { useState, FormEvent, useEffect } from "react";
import { Reminder, AdvanceReminder } from "@/types/reminder";

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (reminder: Omit<Reminder, "id">) => void;
  onEdit?: (id: string, reminder: Omit<Reminder, "id">) => void;
  editingReminder?: Reminder | null;
}

export default function AddReminderModal({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  editingReminder,
}: AddReminderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [reminderCategory, setReminderCategory] = useState("");
  const [recurring, setRecurring] = useState("");
  const [advanceReminders, setAdvanceReminders] = useState<AdvanceReminder[]>([]);

  const isEditMode = !!editingReminder;

  useEffect(() => {
    if (editingReminder) {
      setTitle(editingReminder.title);
      setDescription(editingReminder.description);
      setDate(editingReminder.date);
      setTime(editingReminder.time);
      setCategory(editingReminder.category);
      setReminderCategory(editingReminder.reminderCategory);
      setRecurring(editingReminder.recurring || "");
      setAdvanceReminders(editingReminder.advanceReminders || []);
    } else {
      // Reset form when not editing
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setCategory("");
      setReminderCategory("");
      setRecurring("");
      setAdvanceReminders([]);
    }
  }, [editingReminder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time || !category || !reminderCategory) {
      return;
    }

    const reminderData = {
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      category: category.trim(),
      reminderCategory: reminderCategory.trim(),
      recurring: recurring.trim() || undefined,
      advanceReminders: advanceReminders.length > 0 ? advanceReminders : undefined,
    };

    if (isEditMode && editingReminder && onEdit) {
      onEdit(editingReminder.id, reminderData);
    } else {
      onAdd(reminderData);
    }

    // Reset form
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setCategory("");
    setReminderCategory("");
    setRecurring("");
    setAdvanceReminders([]);
    onClose();
  };

  const handleAddAdvanceReminder = () => {
    if (advanceReminders.length < 10) {
      setAdvanceReminders([...advanceReminders, { amount: 1, unit: "hours" }]);
    }
  };

  const handleRemoveAdvanceReminder = (index: number) => {
    setAdvanceReminders(advanceReminders.filter((_, i) => i !== index));
  };

  const handleUpdateAdvanceReminder = (
    index: number,
    field: "amount" | "unit",
    value: number | string
  ) => {
    const updated = [...advanceReminders];
    updated[index] = { ...updated[index], [field]: value };
    setAdvanceReminders(updated);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
          {isEditMode ? "Edit Reminder" : "Add New Reminder"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              placeholder="Enter reminder title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              placeholder="Enter reminder description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div>
              <label
                htmlFor="time"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">Select a type</option>
              <option value="birthday">Birthday</option>
              <option value="holiday">Holiday</option>
              <option value="anniversary">Anniversary</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="reminderCategory"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Reminder Type <span className="text-red-500">*</span>
            </label>
            <select
              id="reminderCategory"
              value={reminderCategory}
              onChange={(e) => setReminderCategory(e.target.value)}
              required
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">Select a reminder type</option>
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="google calendar">Google Calendar</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="recurring"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Recurring (Optional)
            </label>
            <select
              id="recurring"
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="">No recurrence</option>
              <option value="every week">Every Week</option>
              <option value="4 weeks">4 Weeks</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Advance Reminders (Optional)
              </label>
              {advanceReminders.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddAdvanceReminder}
                  className="text-sm text-zinc-600 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  + Add Reminder
                </button>
              )}
            </div>
            {advanceReminders.length > 0 && (
              <div className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                {advanceReminders.map((reminder, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-md bg-white p-2 dark:bg-zinc-900"
                  >
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Remind me
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={reminder.amount}
                      onChange={(e) =>
                        handleUpdateAdvanceReminder(
                          index,
                          "amount",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                    />
                    <select
                      value={reminder.unit}
                      onChange={(e) =>
                        handleUpdateAdvanceReminder(index, "unit", e.target.value)
                      }
                      className="flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                    >
                      <option value="minutes">minute(s) before</option>
                      <option value="hours">hour(s) before</option>
                      <option value="days">day(s) before</option>
                      <option value="weeks">week(s) before</option>
                      <option value="months">month(s) before</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdvanceReminder(index)}
                      className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-700"
                      aria-label="Remove reminder"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                {advanceReminders.length >= 10 && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Maximum of 10 advance reminders reached
                  </p>
                )}
              </div>
            )}
            {advanceReminders.length === 0 && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No advance reminders set. Click "+ Add Reminder" to add one.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isEditMode ? "Update Reminder" : "Add Reminder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

