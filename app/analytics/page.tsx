import { BarChart, LineChart, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your financial performance and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portfolio Value Card */}
        <div className="bg-white dark:bg-[#1F1F23] p-6 rounded-xl border border-gray-200 dark:border-[#2D2D33]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Value</h2>
            <LineChart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$124,589.32</p>
          <p className="text-sm text-green-600 mt-2">+2.5% from last month</p>
        </div>

        {/* Asset Allocation Card */}
        <div className="bg-white dark:bg-[#1F1F23] p-6 rounded-xl border border-gray-200 dark:border-[#2D2D33]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Asset Allocation</h2>
            <PieChart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Stocks</span>
              <span className="text-gray-900 dark:text-white font-medium">60%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Bonds</span>
              <span className="text-gray-900 dark:text-white font-medium">25%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cash</span>
              <span className="text-gray-900 dark:text-white font-medium">15%</span>
            </div>
          </div>
        </div>

        {/* Monthly Returns Card */}
        <div className="bg-white dark:bg-[#1F1F23] p-6 rounded-xl border border-gray-200 dark:border-[#2D2D33]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Returns</h2>
            <BarChart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">January</span>
              <span className="text-green-600">+3.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">February</span>
              <span className="text-red-600">-1.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">March</span>
              <span className="text-green-600">+2.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Section */}
      <div className="mt-8 bg-white dark:bg-[#1F1F23] p-6 rounded-xl border border-gray-200 dark:border-[#2D2D33]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Annual Return</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">+12.8%</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Risk Level</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Moderate</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Sharpe Ratio</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">1.45</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Beta</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0.85</p>
          </div>
        </div>
      </div>
    </div>
  )
} 