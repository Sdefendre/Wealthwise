"use client"

import { useMemo, useState, type ReactNode } from "react"
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  LineChart as LineChartIcon,
  PiggyBank,
  Wallet,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "./badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import Layout from "./layout"
import StatementUpload from "./statement-upload"
import { formatCurrency, mergeTransactions, summarizeTransactions } from "@/lib/finance"
import type { StatementUploadContext, Transaction } from "@/lib/finance"

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "2024-01-02-salary",
    date: "2024-01-02",
    description: "Monthly Salary",
    amount: 5200,
    category: "Income",
    account: "Checking",
  },
  {
    id: "2024-01-03-rent",
    date: "2024-01-03",
    description: "Rent Payment",
    amount: -2100,
    category: "Housing",
    account: "Checking",
  },
  {
    id: "2024-01-05-invest",
    date: "2024-01-05",
    description: "Brokerage Contribution",
    amount: -600,
    category: "Investments",
    account: "Brokerage",
  },
  {
    id: "2024-01-08-groceries",
    date: "2024-01-08",
    description: "Whole Foods",
    amount: -185.24,
    category: "Groceries",
    account: "Checking",
  },
  {
    id: "2024-01-12-savings",
    date: "2024-01-12",
    description: "Automatic Savings Transfer",
    amount: -500,
    category: "Savings",
    account: "High-Yield Savings",
  },
  {
    id: "2024-01-15-freelance",
    date: "2024-01-15",
    description: "Freelance Project",
    amount: 1200,
    category: "Income",
    account: "Checking",
  },
  {
    id: "2024-01-18-dining",
    date: "2024-01-18",
    description: "Dinner with friends",
    amount: -92.5,
    category: "Dining",
    account: "Credit Card",
  },
  {
    id: "2024-01-22-subscription",
    date: "2024-01-22",
    description: "Streaming Subscription",
    amount: -19.99,
    category: "Subscriptions",
    account: "Credit Card",
  },
  {
    id: "2024-01-27-health",
    date: "2024-01-27",
    description: "Gym Membership",
    amount: -75,
    category: "Wellness",
    account: "Credit Card",
  },
  {
    id: "2024-01-30-dividend",
    date: "2024-01-30",
    description: "Dividend Payout",
    amount: 82.65,
    category: "Investments",
    account: "Brokerage",
  },
]

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    INITIAL_TRANSACTIONS
  )
  const [lastImport, setLastImport] = useState<StatementUploadContext | null>(
    null
  )

  const summary = useMemo(
    () => summarizeTransactions(transactions),
    [transactions]
  )

  const handleImport = (
    importedTransactions: Transaction[],
    context: StatementUploadContext
  ) => {
    setTransactions((existing) =>
      mergeTransactions(existing, importedTransactions)
    )
    setLastImport(context)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Net Cash Flow"
            value={formatCurrency(summary.netCash)}
            description="Income minus spending"
            icon={<Wallet className="h-5 w-5" />}
            accent="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            title="Income"
            value={formatCurrency(summary.totalIncome)}
            description="Across all accounts"
            icon={<ArrowDownCircle className="h-5 w-5" />}
            accent="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            title="Expenses"
            value={formatCurrency(summary.totalExpenses)}
            description="Tracked this period"
            icon={<ArrowUpCircle className="h-5 w-5" />}
            accent="text-rose-600 dark:text-rose-400"
          />
          <StatCard
            title="Savings Rate"
            value={`${summary.savingsRate.toFixed(1)}%`}
            description="Savings & investments vs. income"
            icon={<PiggyBank className="h-5 w-5" />}
            accent="text-indigo-600 dark:text-indigo-400"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UploadIllustration />
                Import a bank statement
              </CardTitle>
              <CardDescription>
                Upload a CSV export from your bank. We will automatically
                categorize transactions and update your dashboards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatementUpload onImport={handleImport} />
              {lastImport && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Imported <strong>{lastImport.count}</strong> transactions from
                  <strong> {lastImport.fileName}</strong> on {" "}
                  {lastImport.importedAt.toLocaleDateString()}.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Capital allocation</CardTitle>
              <CardDescription>
                Track how much you are directing to savings and long-term
                investments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AllocationRow
                label="Savings"
                value={summary.totalSavings}
                percent={summary.incomeShare.savings}
                accent="bg-indigo-500"
              />
              <AllocationRow
                label="Investments"
                value={summary.totalInvestments}
                percent={summary.incomeShare.investments}
                accent="bg-emerald-500"
              />
              <AllocationRow
                label="Everyday spending"
                value={summary.totalExpenses}
                percent={summary.incomeShare.expenses}
                accent="bg-rose-500"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-col gap-2 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-lg">Monthly cash flow</CardTitle>
                <CardDescription>
                  Income and expenses grouped by statement month.
                </CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <LineChartIcon className="h-3.5 w-3.5" />
                {summary.monthlyCashflow.length} months
              </Badge>
            </CardHeader>
            <CardContent className="h-[320px]">
              <AreaChart data={summary.monthlyCashflow}>
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelClassName="font-medium"
                  contentStyle={{
                    background: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#0f766e"
                  fill="url(#income)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#be123c"
                  fill="url(#expenses)"
                  name="Expenses"
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stroke="#2563eb"
                  fill="#2563eb0D"
                  name="Net"
                />
              </AreaChart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Spending by category</CardTitle>
              <CardDescription>
                Where your outgoing cash is concentrated.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <PieChart width={260} height={260}>
                <Pie
                  data={summary.expenseBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={3}
                >
                  {summary.expenseBreakdown.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Legend />
              </PieChart>
              <div className="grid w-full grid-cols-1 gap-3">
                {summary.expenseBreakdown.map((entry, index) => (
                  <div
                    key={entry.category}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-muted/40 p-3 text-sm"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                        }}
                      />
                      {entry.category}
                    </span>
                    <span>{formatCurrency(entry.amount)}</span>
                  </div>
                ))}
                {!summary.expenseBreakdown.length && (
                  <p className="text-center text-sm text-muted-foreground">
                    Upload a statement to see categorized spending.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Monthly spending trend</CardTitle>
              <CardDescription>
                Compare how your expenses change from month to month.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <BarChart data={summary.monthlyExpenses}>
                <CartesianGrid strokeDasharray="4 4" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#7c3aed" />
              </BarChart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Account balances</CardTitle>
              <CardDescription>
                Running balance based on the imported statement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.accountBalances.map((account) => (
                <div
                  key={account.account}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {account.account}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {account.transactionCount} transactions
                    </span>
                  </div>
                  <span
                    className={
                      account.balance >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }
                  >
                    {formatCurrency(account.balance)}
                  </span>
                </div>
              ))}
              {!summary.accountBalances.length && (
                <p className="text-sm text-muted-foreground">
                  Import a statement that includes account names to see a
                  balance overview.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Recent transactions</CardTitle>
            <CardDescription>
              A quick view of the latest activity pulled from your statements.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                  <th className="px-4 py-2 font-medium">Category</th>
                  <th className="px-4 py-2 font-medium text-right">Amount</th>
                  <th className="px-4 py-2 font-medium text-right">Account</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-border/60 text-sm last:border-b"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {transaction.formattedDate}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="capitalize text-xs font-medium"
                      >
                        {transaction.category || "Uncategorized"}
                      </Badge>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        transaction.amount >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {transaction.account || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

const CATEGORY_COLORS = [
  "#1d4ed8",
  "#9333ea",
  "#f97316",
  "#0f766e",
  "#ef4444",
  "#14b8a6",
  "#f59e0b",
  "#6366f1",
]

function StatCard({
  title,
  value,
  description,
  icon,
  accent,
}: {
  title: string
  value: string
  description: string
  icon: ReactNode
  accent: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className={`rounded-full bg-muted px-2 py-1 text-xs font-semibold ${accent}`}>
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function AllocationRow({
  label,
  value,
  percent,
  accent,
}: {
  label: string
  value: number
  percent: number
  accent: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{label}</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`${accent} h-full transition-all`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {formatCurrency(value)} directed to {label.toLowerCase()}.
      </p>
    </div>
  )
}

function UploadIllustration() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
      <Landmark className="h-5 w-5" />
    </span>
  )
}
