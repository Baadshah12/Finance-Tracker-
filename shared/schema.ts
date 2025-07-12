import { pgTable, text, serial, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(), // Store as YYYY-MM-DD string for simplicity
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

// Categories enum for validation
export const EXPENSE_CATEGORIES = [
  "food",
  "transportation", 
  "entertainment",
  "shopping",
  "healthcare",
  "utilities",
  "other"
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// Enhanced schema with validation
export const expenseFormSchema = insertExpenseSchema.extend({
  amount: z.string().min(1, "Amount is required").transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      throw new Error("Amount must be a positive number");
    }
    return num.toFixed(2);
  }),
  category: z.enum(EXPENSE_CATEGORIES, {
    required_error: "Please select a category",
  }),
  description: z.string().min(1, "Description is required").max(255, "Description too long"),
  date: z.string().min(1, "Date is required"),
});
