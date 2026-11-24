import { parse, format } from "date-fns"

export type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  category: string
  account?: string
}

export type StatementUploadContext = {
  fileName: string
  count: number
  importedAt: Date
}

export type FinancialSummary = {
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  totalInvestments: number
  netCash: number
  savingsRate: number
  incomeShare: {
    savings: number
    investments: number
    expenses: number
  }
  expenseBreakdown: { category: string; amount: number }[]
  monthlyCashflow: { month: string; income: number; expenses: number; net: number }[]
  monthlyExpenses: { month: string; amount: number }[]
  accountBalances: { account: string; balance: number; transactionCount: number }[]
  recentTransactions: (Transaction & { formattedDate: string })[]
}

const SUPPORTED_DATE_FORMATS = [
  "yyyy-MM-dd",
  "MM/dd/yyyy",
  "dd/MM/yyyy",
  "MMM d, yyyy",
  "d MMM yyyy",
]

export function parseCsvStatement(csv: string): Transaction[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!lines.length) return []

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase())
  const dateIndex = headers.findIndex((header) => header.includes("date"))
  const descriptionIndex = headers.findIndex((header) =>
    header.includes("description")
  )
  const amountIndex = headers.findIndex((header) => header.includes("amount"))
  const categoryIndex = headers.findIndex((header) =>
    header.includes("category") || header.includes("type")
  )
  const accountIndex = headers.findIndex((header) => header.includes("account"))

  if (dateIndex === -1 || descriptionIndex === -1 || amountIndex === -1) {
    throw new Error(
      "CSV must include at least Date, Description, and Amount columns."
    )
  }

  const transactions: Transaction[] = []

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i])
    if (!cells.length) continue

    const rawDate = cells[dateIndex]?.trim()
    const rawDescription = cells[descriptionIndex]?.trim()
    const rawAmount = cells[amountIndex]?.trim()

    if (!rawDate || !rawDescription || !rawAmount) continue

    const amount = parseAmount(rawAmount)
    const category = cells[categoryIndex]?.trim() || inferCategory(rawDescription)
    const account = cells[accountIndex]?.trim()

    transactions.push({
      id: `${rawDate}-${rawDescription}-${amount}-${i}`,
      date: normalizeDate(rawDate),
      description: rawDescription,
      amount,
      category,
      account,
    })
  }

  return transactions
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)

  return result.map((value) => value.trim())
}

function parseAmount(value: string): number {
  const sanitized = value.replace(/[$,\s]/g, "")
  if (!sanitized) return 0

  let amount = Number.parseFloat(sanitized.replace(/[()]/g, ""))
  if (Number.isNaN(amount)) return 0

  const isNegative = sanitized.includes("-") || /\(.+\)/.test(value)
  return isNegative ? -Math.abs(amount) : amount
}

function normalizeDate(value: string): string {
  for (const formatString of SUPPORTED_DATE_FORMATS) {
    const parsed = parse(value, formatString, new Date())
    if (!Number.isNaN(parsed.getTime())) {
      return format(parsed, "yyyy-MM-dd")
    }
  }

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return format(parsed, "yyyy-MM-dd")
  }

  return value
}

function inferCategory(description: string): string {
  const normalized = description.toLowerCase()

  if (normalized.includes("rent") || normalized.includes("mortgage")) {
    return "Housing"
  }
  if (normalized.includes("grocery") || normalized.includes("market")) {
    return "Groceries"
  }
  if (normalized.includes("salary") || normalized.includes("pay")) {
    return "Income"
  }
  if (normalized.includes("invest")) {
    return "Investments"
  }
  if (normalized.includes("transfer") || normalized.includes("savings")) {
    return "Savings"
  }
  if (normalized.includes("utility") || normalized.includes("electric")) {
    return "Utilities"
  }
  return "Uncategorized"
}

export function summarizeTransactions(transactions: Transaction[]): FinancialSummary {
  let totalIncome = 0
  let totalExpenses = 0
  let totalSavings = 0
  let totalInvestments = 0

  const expenseCategories = new Map<string, number>()
  const monthlyCash = new Map<
    string,
    { month: string; income: number; expenses: number; net: number }
  >()
  const monthlyExpenseTotals = new Map<string, number>()
  const accountBalances = new Map<
    string,
    { balance: number; transactionCount: number }
  >()

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  for (const transaction of sortedTransactions) {
    const amount = transaction.amount
    const bucket = inferBucket(transaction)

    if (amount >= 0) {
      totalIncome += amount
    } else {
      totalExpenses += Math.abs(amount)
      const category = transaction.category || "Uncategorized"
      expenseCategories.set(
        category,
        (expenseCategories.get(category) ?? 0) + Math.abs(amount)
      )
    }

    if (bucket === "savings") {
      totalSavings += Math.abs(amount)
    } else if (bucket === "investments") {
      totalInvestments += Math.abs(amount)
    }

    const monthKey = format(new Date(transaction.date), "yyyy-MM")
    const monthLabel = format(new Date(transaction.date), "MMM yyyy")
    if (!monthlyCash.has(monthKey)) {
      monthlyCash.set(monthKey, { month: monthLabel, income: 0, expenses: 0, net: 0 })
    }
    const monthly = monthlyCash.get(monthKey)!
    if (amount >= 0) {
      monthly.income += amount
    } else {
      monthly.expenses += Math.abs(amount)
    }
    monthly.net += amount

    monthlyExpenseTotals.set(
      monthKey,
      (monthlyExpenseTotals.get(monthKey) ?? 0) + Math.abs(Math.min(amount, 0))
    )

    if (transaction.account) {
      const account = accountBalances.get(transaction.account) ?? {
        balance: 0,
        transactionCount: 0,
      }
      account.balance += amount
      account.transactionCount += 1
      accountBalances.set(transaction.account, account)
    }
  }

  const netCash = totalIncome - totalExpenses
  const savingsRateBase = totalIncome || 1
  const savingsRate = ((totalSavings + totalInvestments) / savingsRateBase) * 100

  const incomeShare = {
    savings: totalIncome ? (totalSavings / totalIncome) * 100 : 0,
    investments: totalIncome ? (totalInvestments / totalIncome) * 100 : 0,
    expenses: totalIncome ? (totalExpenses / totalIncome) * 100 : 0,
  }

  const expenseBreakdown = Array.from(expenseCategories.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  const monthlyCashflow = Array.from(monthlyCash.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([, value]) => value)

  const monthlyExpenses = Array.from(monthlyExpenseTotals.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, amount]) => ({
      month: monthlyCash.get(month)?.month ?? month,
      amount,
    }))

  const recentTransactions = sortedTransactions.slice(0, 8).map((transaction) => ({
    ...transaction,
    formattedDate: format(new Date(transaction.date), "MMM d, yyyy"),
  }))

  const accounts = Array.from(accountBalances.entries())
    .map(([account, value]) => ({ account, ...value }))
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))

  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    totalInvestments,
    netCash,
    savingsRate,
    incomeShare,
    expenseBreakdown,
    monthlyCashflow,
    monthlyExpenses,
    accountBalances: accounts,
    recentTransactions,
  }
}

function inferBucket(transaction: Transaction): "income" | "expenses" | "savings" | "investments" {
  const normalizedCategory = (transaction.category || "").toLowerCase()
  const normalizedDescription = transaction.description.toLowerCase()

  if (normalizedCategory.includes("invest") || normalizedDescription.includes("invest")) {
    return "investments"
  }

  if (
    normalizedCategory.includes("savings") ||
    normalizedCategory.includes("emergency") ||
    normalizedDescription.includes("savings") ||
    normalizedDescription.includes("transfer")
  ) {
    return "savings"
  }

  if (transaction.amount < 0) {
    return "expenses"
  }

  return "income"
}

export function mergeTransactions(
  existing: Transaction[],
  incoming: Transaction[]
): Transaction[] {
  const seen = new Set<string>()
  const merged: Transaction[] = []

  const add = (transaction: Transaction) => {
    const key = `${transaction.date}-${transaction.description}-${transaction.amount}-${transaction.account ?? ""}`
    if (seen.has(key)) return
    seen.add(key)
    merged.push(transaction)
  }

  existing.forEach(add)
  incoming.forEach(add)

  return merged.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function createUploadContext(
  fileName: string,
  count: number
): StatementUploadContext {
  return {
    fileName,
    count,
    importedAt: new Date(),
  }
}
