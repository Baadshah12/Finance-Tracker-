import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface MonthlyData {
  month: number;
  spending: number;
  name: string;
}

export default function SpendingChart() {
  const { data: monthlyData, isLoading } = useQuery<MonthlyData[]>({
    queryKey: ["/api/analytics/monthly-trends"],
  });

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Spending Trends</h3>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!monthlyData || monthlyData.length === 0) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Spending Trends</h3>
          <p className="text-gray-500 text-center py-8">No spending data available</p>
        </CardContent>
      </Card>
    );
  }

  const maxSpending = Math.max(...monthlyData.map(d => d.spending));
  const currentMonth = new Date().getMonth() + 1;
  
  // Show all months but highlight ones with spending
  const chartData = monthlyData;

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Spending Trends</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {chartData.map((data) => {
            const heightPercentage = maxSpending > 0 ? (data.spending / maxSpending) * 100 : 0;
            const isCurrentMonth = data.month === currentMonth;
            
            // Ensure minimum visible height for bars with spending
            const displayHeight = data.spending > 0 ? Math.max(heightPercentage, 8) : heightPercentage;
            
            return (
              <div key={data.month} className="flex flex-col items-center space-y-2 flex-1">
                <div 
                  className={`w-full max-w-12 rounded-t transition-all duration-300 ${
                    isCurrentMonth 
                      ? 'bg-orange-500' 
                      : data.spending > (maxSpending * 0.8) 
                        ? 'bg-red-500' 
                        : 'bg-primary'
                  }`}
                  style={{ height: `${displayHeight}%` }}
                  title={`${data.name}: $${data.spending.toFixed(2)}`}
                ></div>
                <span className={`text-xs ${isCurrentMonth ? 'font-medium text-orange-600' : 'text-gray-600'}`}>
                  {data.name}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Monthly spending amounts (hover bars for exact values)
        </div>
      </CardContent>
    </Card>
  );
}
