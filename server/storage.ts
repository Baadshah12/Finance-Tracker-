import { expenses, type Expense, type InsertExpense } from "@shared/schema";

export interface IStorage {
  // Expense operations
  createExpense(expense: InsertExpense): Promise<Expense>;
  getExpenses(): Promise<Expense[]>;
  getExpenseById(id: number): Promise<Expense | undefined>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
  
  // Analytics operations
  getExpensesByCategory(): Promise<{ category: string; total: number; count: number }[]>;
  getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]>;
  getTotalSpending(): Promise<number>;
  getMonthlySpending(year: number, month: number): Promise<number>;
  getWeeklySpending(startDate: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private expenses: Map<number, Expense>;
  private currentId: number;

  constructor() {
    this.expenses = new Map();
    this.currentId = 1;
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentId++;
    const expense: Expense = {
      ...insertExpense,
      id,
      createdAt: new Date(),
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getExpenseById(id: number): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async updateExpense(id: number, updateData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const existing = this.expenses.get(id);
    if (!existing) return undefined;
    
    const updated: Expense = {
      ...existing,
      ...updateData,
    };
    this.expenses.set(id, updated);
    return updated;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }

  async getExpensesByCategory(): Promise<{ category: string; total: number; count: number }[]> {
    const categoryMap = new Map<string, { total: number; count: number }>();
    
    const expenseArray = Array.from(this.expenses.values());
    for (const expense of expenseArray) {
      const existing = categoryMap.get(expense.category) || { total: 0, count: 0 };
      categoryMap.set(expense.category, {
        total: existing.total + parseFloat(expense.amount),
        count: existing.count + 1,
      });
    }

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
    }));
  }

  async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => expense.date >= startDate && expense.date <= endDate
    );
  }

  async getTotalSpending(): Promise<number> {
    const expenseArray = Array.from(this.expenses.values());
    return expenseArray.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0
    );
  }

  async getMonthlySpending(year: number, month: number): Promise<number> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
    const monthlyExpenses = await this.getExpensesByDateRange(startDate, endDate);
    return monthlyExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  }

  async getWeeklySpending(startDate: string): Promise<number> {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const endDateStr = end.toISOString().split('T')[0];
    const weeklyExpenses = await this.getExpensesByDateRange(startDate, endDateStr);
    return weeklyExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  }
}

export const storage = new MemStorage();
