"use client"

import { useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Upload,
} from "lucide-react"

import sampleStatementCsv from "@/fixtures/sample-statement.csv"
import {
  createUploadContext,
  parseCsvStatement,
  type StatementUploadContext,
  type Transaction,
} from "@/lib/finance"
import { cn } from "@/lib/utils"

interface StatementUploadProps {
  onImport?: (transactions: Transaction[], context: StatementUploadContext) => void
}

export default function StatementUpload({ onImport }: StatementUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleFileSelection(file)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelection(file)
    }
  }

  const handleFileSelection = (file: File) => {
    const allowedTypes = ["text/csv", "application/vnd.ms-excel"]
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".csv")) {
      setError("Please upload a CSV file exported from your bank.")
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setError(null)
    setSuccess(null)
  }

  const handleProcess = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      const text = await selectedFile.text()
      const transactions = parseCsvStatement(text)

      if (!transactions.length) {
        throw new Error(
          "We could not find any transactions in this file. Double-check the header row."
        )
      }

      const context = createUploadContext(selectedFile.name, transactions.length)
      onImport?.(transactions, context)

      setSuccess(`Imported ${transactions.length} transactions.`)
      setSelectedFile(null)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while parsing your statement."
      setError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleStatementCsv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "wealthwise-sample-statement.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition",
          isDragging
            ? "border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-500/10"
            : "border-muted",
          "hover:border-blue-500 hover:bg-blue-50/40 dark:hover:border-blue-400 dark:hover:bg-blue-500/10"
        )}
      >
        <label
          htmlFor="statement-upload"
          className="flex w-full cursor-pointer flex-col items-center gap-3 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {selectedFile ? selectedFile.name : "Drop your statement or browse"}
            </p>
            <p className="text-xs text-muted-foreground">
              Accepted format: CSV exported from your bank
            </p>
          </div>
          <input
            id="statement-upload"
            name="statement-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleInputChange}
          />
        </label>
        <button
          type="button"
          onClick={handleProcess}
          disabled={!selectedFile || isProcessing}
          className={cn(
            "mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition",
            "disabled:cursor-not-allowed disabled:bg-blue-400/60"
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" /> Import statement
            </>
          )}
        </button>
      </div>

      <div className="grid gap-3 rounded-lg border border-dashed border-muted p-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 h-4 w-4" />
          <div>
            <p className="font-medium text-foreground">Statement requirements</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Include a header row with Date, Description, Amount, Category, Account.</li>
              <li>Amounts should be positive for income and negative for expenses.</li>
              <li>One transaction per row. Additional columns are ignored automatically.</li>
            </ul>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-2 self-start text-xs font-semibold text-blue-600 hover:text-blue-500"
        >
          <Download className="h-3.5 w-3.5" /> Download a sample CSV
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}
    </div>
  )
}
