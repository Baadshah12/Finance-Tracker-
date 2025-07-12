import { Wallet } from "lucide-react";
import FinancialOverview from "@/components/financial-overview";
import ExpenseForm from "@/components/expense-form";
import CategoryBreakdown from "@/components/category-breakdown";
import ExpenseHistory from "@/components/expense-history";
import SpendingChart from "@/components/spending-chart";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[hsl(var(--finance-bg))]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wallet className="text-2xl text-primary" />
                <h1 className="text-xl font-bold text-gray-900">FinanceTracker</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <span className="text-gray-700 font-medium">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Overview</h2>
          <FinancialOverview />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Expense Form and Category Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            <ExpenseForm />
            <CategoryBreakdown />
          </div>

          {/* Right Column: Expense History */}
          <div className="lg:col-span-2">
            <ExpenseHistory />
          </div>
        </div>

        {/* Monthly Spending Chart */}
        <div className="mt-8">
          <SpendingChart />
        </div>
      </div>
    </div>
  );
}
