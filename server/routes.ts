import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { expenseFormSchema, insertExpenseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all expenses
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  // Get expense by ID
  app.get("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid expense ID" });
      }
      
      const expense = await storage.getExpenseById(id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expense" });
    }
  });

  // Create new expense
  app.post("/api/expenses", async (req, res) => {
    try {
      const validatedData = expenseFormSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  // Update expense
  app.patch("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid expense ID" });
      }

      const validatedData = expenseFormSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(id, validatedData);
      
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      res.json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update expense" });
    }
  });

  // Delete expense
  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid expense ID" });
      }

      const deleted = await storage.deleteExpense(id);
      if (!deleted) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Get analytics - category breakdown
  app.get("/api/analytics/categories", async (req, res) => {
    try {
      const categories = await storage.getExpensesByCategory();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category analytics" });
    }
  });

  // Get analytics - financial summary
  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const totalSpending = await storage.getTotalSpending();
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      // Get current week start (Monday)
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);
      const weekStartDate = monday.toISOString().split('T')[0];
      
      const monthlySpending = await storage.getMonthlySpending(currentYear, currentMonth);
      const weeklySpending = await storage.getWeeklySpending(weekStartDate);

      // Calculate previous month for comparison
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const prevMonthSpending = await storage.getMonthlySpending(prevYear, prevMonth);
      
      // Calculate previous week for comparison
      const prevWeekStart = new Date(monday);
      prevWeekStart.setDate(monday.getDate() - 7);
      const prevWeekStartDate = prevWeekStart.toISOString().split('T')[0];
      const prevWeekSpending = await storage.getWeeklySpending(prevWeekStartDate);

      // Calculate percentage changes
      const monthlyChange = prevMonthSpending > 0 
        ? ((monthlySpending - prevMonthSpending) / prevMonthSpending * 100)
        : 0;
      
      const weeklyChange = prevWeekSpending > 0
        ? ((weeklySpending - prevWeekSpending) / prevWeekSpending * 100)
        : 0;

      // Calculate total balance (starting balance minus total spending)
      const startingBalance = 5000; // Starting balance
      const totalSpent = await storage.getTotalSpending();
      const totalBalance = startingBalance - totalSpent;
      
      // Calculate savings percentage (remaining balance / starting balance * 100)
      const savingsPercentage = (totalBalance / startingBalance) * 100;

      res.json({
        totalBalance,
        monthlySpending,
        weeklySpending,
        monthlyChange,
        weeklyChange,
        savingsPercentage: Math.max(0, savingsPercentage), // Ensure it doesn't go negative
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial summary" });
    }
  });

  // Get monthly spending data for charts
  app.get("/api/analytics/monthly-trends", async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const months = [];
      
      for (let month = 1; month <= 12; month++) {
        const spending = await storage.getMonthlySpending(currentYear, month);
        months.push({
          month,
          spending,
          name: new Date(currentYear, month - 1).toLocaleString('default', { month: 'short' })
        });
      }
      
      res.json(months);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch monthly trends" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
