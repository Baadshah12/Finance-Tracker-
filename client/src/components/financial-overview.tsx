import { Card, CardContent } from "@/components/ui/card";
import { PiggyBank, TrendingDown, CalendarDays, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FinancialSummary {
  totalBalance: number;
  monthlySpending: number;
  weeklySpending: number;
  monthlyChange: number;
  weeklyChange: number;
  savingsPercentage: number;
}

export default function FinancialOverview() {
  const { data: summary, isLoading } = useQuery<FinancialSummary>({
    queryKey: ["/api/analytics/summary"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load financial summary</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Balance Card */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${summary.totalBalance.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <PiggyBank className="text-primary text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Spending Card */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-red-600">
                -${summary.monthlySpending.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingDown className="text-red-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={summary.monthlyChange >= 0 ? "text-red-600" : "text-green-600"}>
              {summary.monthlyChange >= 0 ? "+" : ""}
              {summary.monthlyChange.toFixed(1)}%
            </span>
            <span className="text-gray-600 ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Spending Card */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                -${summary.weeklySpending.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CalendarDays className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={summary.weeklyChange >= 0 ? "text-red-600" : "text-green-600"}>
              {summary.weeklyChange >= 0 ? "+" : ""}
              {summary.weeklyChange.toFixed(1)}%
            </span>
            <span className="text-gray-600 ml-1">vs last week</span>
          </div>
        </CardContent>
      </Card>

      {/* Savings Percentage Card */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Savings Remaining</p>
              <p className="text-2xl font-bold text-green-600">
                {summary.savingsPercentage.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Target className="text-orange-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${summary.savingsPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
