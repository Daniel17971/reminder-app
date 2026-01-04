export interface AdvanceReminder {
  amount: number;
  unit: "minutes" | "hours" | "days" | "weeks" | "months";
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  reminderCategory: string;
  recurring?: string;
  advanceReminders?: AdvanceReminder[];
}

