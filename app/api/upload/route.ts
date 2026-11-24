import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { transactions } from "@/drizzle/schema"

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

export async function POST(request: Request) {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) {
    console.error('MISTRAL_API_KEY environment variable is not set')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Convert the file to base64
    const buffer = await file.arrayBuffer()
    const base64File = Buffer.from(buffer).toString('base64')

    // Call Mistral API for OCR processing
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this bank statement and extract all transactions. For each transaction, provide the date, description, amount, and determine if it's income or expense. Format the response as a JSON array of transactions with the following structure: [{date: 'YYYY-MM-DD', description: string, amount: number, type: 'income'|'expense', category: string}]"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:application/pdf;base64,${base64File}`
                }
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`)
    }

    const data = await response.json()
    const extractedTransactions = JSON.parse(data.choices[0].message.content)

    // Save transactions to the database using Drizzle
    for (const transaction of extractedTransactions) {
      await db.insert(transactions).values({
        date: new Date(transaction.date),
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({ 
      message: "File processed successfully",
      transactionsCount: extractedTransactions.length 
    })
  } catch (error) {
    console.error("Error processing file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error processing file" },
      { status: 500 }
    )
  }
} 