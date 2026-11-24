"use client"

import { useState } from "react"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  title: string
  amount: string
  type: "incoming" | "outgoing"
  category: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

export default function List02({ transactions = [], className }: { transactions?: Transaction[], className?: string }) {
  const [transactionsState, setTransactionsState] = useState<Transaction[]>(transactions)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setEditValue(transaction.amount.replace(/[^0-9.]/g, ""))
  }

  const handleSave = (id: string) => {
    setTransactionsState(transactionsState.map(transaction => {
      if (transaction.id === id) {
        const numericValue = parseFloat(editValue) || 0
        return {
          ...transaction,
          amount: transaction.type === "incoming" ? 
            `+$${numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
            `-$${numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
      }
      return transaction
    }))
    setEditingId(null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {transactionsState.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-[#1F1F23] hover:bg-gray-50 dark:hover:bg-[#1F1F23] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {transaction.title}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                • {transaction.timestamp}
              </span>
            </div>
          </div>
          <div 
            className="flex items-center gap-1.5"
            onClick={() => handleEdit(transaction)}
          >
            {editingId === transaction.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-32 px-2 py-1 text-right border rounded bg-white dark:bg-[#1F1F23] text-gray-900 dark:text-white"
                  onBlur={() => handleSave(transaction.id)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSave(transaction.id)
                    }
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <span
                className={cn(
                  "text-sm font-medium cursor-pointer",
                  transaction.type === "incoming"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {transaction.amount}
              </span>
            )}
            {transaction.type === "incoming" ? (
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

