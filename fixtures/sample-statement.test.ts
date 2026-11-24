import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { parseCsvStatement } from "../lib/finance"

describe("fixtures/sample-statement.csv", () => {
  it("contains the expected sample header and six fake transactions", () => {
    const csv = readFileSync(
      resolve(__dirname, "sample-statement.csv"),
      "utf8"
    )
    const lines = csv.trimEnd().split("\n")

    expect(lines[0]).toBe("Date,Description,Amount,Category,Account")
    expect(lines).toHaveLength(7)

    const transactions = parseCsvStatement(csv)
    expect(transactions).toHaveLength(6)
    expect(transactions[0]).toMatchObject({
      date: "2024-01-02",
      description: "Monthly Salary",
      amount: 5200,
      category: "Income",
      account: "Checking",
    })
    expect(transactions[5]).toMatchObject({
      date: "2024-01-18",
      description: "Dinner with Friends",
      amount: -92.5,
      category: "Dining",
      account: "Credit Card",
    })
  })
})
