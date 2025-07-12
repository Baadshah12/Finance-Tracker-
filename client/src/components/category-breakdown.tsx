import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface CategoryData {
  category: string;
  total: number;
  count: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍕",
  transportation: "🚗",
  entertainment: "🎬",
  shopping: "🛒",
  healthcare: "🏥",
  utilities: "💡",
  other: "📋",
};

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-red-500",
  transportation: "bg-blue-500",
  entertainment: "bg-green-500",
  shopping: "bg-yellow-500",
  healthcare: "bg-purple-500",
  utilities: "bg-indigo-500",
  other: "bg-gray-500",
};

export default function CategoryBreakdown() {
  const { data: categories, isLoading } = useQuery<CategoryData[]>({
    queryKey: ["/api/analytics/categories"],
  });

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
          <p className="text-gray-500 text-center py-8">No expenses yet</p>
        </CardContent>
      </Card>
    );
  }

  const totalSpending = categories.reduce((sum, cat) => sum + cat.total, 0);

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
        <div className="space-y-4">
          {categories.map((category) => {
            const percentage = totalSpending > 0 ? (category.total / totalSpending) * 100 : 0;
            const colorClass = CATEGORY_COLORS[category.category] || "bg-gray-500";
            const icon = CATEGORY_ICONS[category.category] || "📋";
            const categoryName = category.category.charAt(0).toUpperCase() + category.category.slice(1);

            return (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${colorClass} rounded-full`}></div>
                  <span className="text-gray-700">
                    {icon} {categoryName}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${category.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {percentage.toFixed(0)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
