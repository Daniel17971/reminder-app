"use client";

import { useState, useMemo } from "react";
import { Reminder } from "@/types/reminder";
import AddReminderModal from "@/components/AddReminderModal";
import ReminderList from "@/components/ReminderList";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { logout } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleAddReminder = (reminderData: Omit<Reminder, "id">) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setReminders([...reminders, newReminder]);
  };

  const handleEditReminder = (id: string, reminderData: Omit<Reminder, "id">) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id ? { ...reminderData, id } : reminder
      )
    );
    setEditingReminder(null);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  const handleOpenEditModal = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReminder(null);
  };

  // Get unique types from reminders for filter dropdown
  const availableTypes = useMemo(() => {
    const types = reminders.map((r) => r.category);
    return Array.from(new Set(types)).sort();
  }, [reminders]);

  // Filter and sort reminders
  const filteredAndSortedReminders = useMemo(() => {
    let filtered = reminders;

    // Filter by search query (title or description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reminder) =>
          reminder.title.toLowerCase().includes(query) ||
          reminder.description.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (typeFilter) {
      filtered = filtered.filter((reminder) => reminder.category === typeFilter);
    }

    // Sort by date
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return sorted;
  }, [reminders, searchQuery, typeFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Reminder App
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Keep track of your important events and reminders
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search Bar */}
            <div className="flex-1">
              <label
                htmlFor="search"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 pl-10 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <label
                htmlFor="typeFilter"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Filter by Type
              </label>
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="">All Types</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="sm:w-48">
              <label
                htmlFor="sortOrder"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Sort by Date
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="asc">Ascending (Oldest First)</option>
                <option value="desc">Descending (Newest First)</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || typeFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("");
              }}
              className="text-sm text-zinc-600 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Clear filters
            </button>
          )}
        </div>

        <ReminderList
          reminders={filteredAndSortedReminders}
          onDelete={handleDeleteReminder}
          onEdit={handleOpenEditModal}
          hasFilters={!!(searchQuery || typeFilter)}
        />

        <button
          onClick={() => {
            setEditingReminder(null);
            setIsModalOpen(true);
          }}
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
          onClose={handleCloseModal}
          onAdd={handleAddReminder}
          onEdit={handleEditReminder}
          editingReminder={editingReminder}
        />
      </main>
    </div>
  );
}
