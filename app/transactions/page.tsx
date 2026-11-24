import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react"
import StatementUpload from "@/components/ui/statement-upload"
import { prisma } from "@/lib/prisma"

interface Transaction {
  id: number
  date: Date
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  createdAt: Date
  updatedAt: Date
}

/** Normalize a raw DB row (whose `type` is a plain string) into a typed Transaction. */
function toTransaction(row: {
  id: number
  date: Date
  description: string
  amount: number
  type: string
  category: string
  createdAt: Date
  updatedAt: Date
}): Transaction {
  return {
    ...row,
    type: row.type === "income" ? "income" : "expense",
  }
}

async function getTransactions(): Promise<Transaction[]> {
  const transactions = await prisma.transaction.findMany({
    orderBy: {
      date: 'desc'
    }
  })
  return transactions.map(toTransaction)
}

async function getTransactionSummary() {
  const rows = await prisma.transaction.findMany()
  const transactions = rows.map(toTransaction)
  const totalIncome = transactions
    .filter((t: Transaction) => t.type === "income")
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
    
  const totalExpenses = transactions
    .filter((t: Transaction) => t.type === "expense")
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
    
  const netBalance = totalIncome - totalExpenses

  return {
    totalIncome,
    totalExpenses,
    netBalance
  }
}

export default async function TransactionsPage() {
  const transactions = await getTransactions()
  const summary = await getTransactionSummary()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transactions</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage your financial transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1F1F23] p-6 rounded-xl border border-gray-200 dark:border-[#2D2D33]">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Income</h2>
          <p className="text-2xl font-bold text-green-600">+${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-[#1F1F23] p-6 rounded-xl border border-gray-200 dark:border-[#2D2D33]">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Expenses</h2>
          <p className="text-2xl font-bold text-red-600">-${summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-[#1F1F23] p-6 rounded-xl border border-gray-200 dark:border-[#2D2D33]">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Net Balance</h2>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${summary.netBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* Statement Upload */}
      <div className="bg-white dark:bg-[#1F1F23] p-6 rounded-xl border border-gray-200 dark:border-[#2D2D33] mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Statement</h2>
        <StatementUpload />
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-[#1F1F23] p-4 rounded-xl border border-gray-200 dark:border-[#2D2D33] mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#2D2D33] rounded-md bg-white dark:bg-[#0F0F12] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex gap-4">
            <select className="px-4 py-2 border border-gray-200 dark:border-[#2D2D33] rounded-md bg-white dark:bg-[#0F0F12] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              <option value="shopping">Shopping</option>
              <option value="income">Income</option>
              <option value="food">Food & Drinks</option>
              <option value="entertainment">Entertainment</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 dark:border-[#2D2D33] rounded-md bg-white dark:bg-[#0F0F12] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Last 30 Days</option>
              <option value="7">Last 7 Days</option>
              <option value="60">Last 60 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2D2D33] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#2D2D33]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: Transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-200 dark:border-[#2D2D33] last:border-0 hover:bg-gray-50 dark:hover:bg-[#2D2D33]"
                >
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      {transaction.type === "expense" ? (
                        <ArrowDownIcon className="w-4 h-4 text-red-500 mr-2" />
                      ) : (
                        <ArrowUpIcon className="w-4 h-4 text-green-500 mr-2" />
                      )}
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{transaction.category}</td>
                  <td className={`px-6 py-4 text-sm text-right ${
                    transaction.type === "expense" ? "text-red-600" : "text-green-600"
                  }`}>
                    {transaction.type === "expense" ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 