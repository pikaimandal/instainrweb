"use client"

import { useState } from "react"

interface Transaction {
  id: string
  type: string
  fromCurrency: string
  fromAmount: number
  toAmount: number
  date: string
  time: string
  status: "pending" | "completed"
  timeRemaining?: number
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions: initialTransactions }: TransactionHistoryProps) {
  const [filter, setFilter] = useState("all")
  const [transactions, setTransactions] = useState(initialTransactions)

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true
    if (filter === "pending") return transaction.status === "pending"
    if (filter === "completed") return transaction.status === "completed"
    return true
  })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Transaction History</h2>

      <div className="flex gap-3 mb-5 overflow-x-auto pb-2">
        <button
          className={`px-4 py-2 border border-border rounded-full bg-white text-text-secondary text-sm cursor-pointer whitespace-nowrap ${filter === "all" ? "bg-primary text-white border-primary" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 border border-border rounded-full bg-white text-text-secondary text-sm cursor-pointer whitespace-nowrap ${filter === "pending" ? "bg-primary text-white border-primary" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 border border-border rounded-full bg-white text-text-secondary text-sm cursor-pointer whitespace-nowrap ${filter === "completed" ? "bg-primary text-white border-primary" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-xl p-4 flex items-start shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                  transaction.status === "completed" ? "bg-success/10 text-success" : "bg-pending/10 text-pending"
                }`}
              >
                <i className={`fas ${transaction.status === "completed" ? "fa-check" : "fa-clock"}`}></i>
              </div>

              <div className="flex-1">
                <div className="font-semibold mb-1">{transaction.type}</div>
                <div className="text-xs text-text-tertiary mb-2">
                  {transaction.date} • {transaction.time}
                </div>

                {transaction.status === "pending" && (
                  <div className="flex items-center text-xs text-warning bg-warning/10 px-2 py-1 rounded inline-flex">
                    <div className="mr-1">
                      <i className="fas fa-hourglass-half"></i>
                    </div>
                    <div>{transaction.timeRemaining} minutes remaining</div>
                  </div>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-sm text-text-secondary mb-1">
                  {transaction.fromAmount} {transaction.fromCurrency}
                </div>
                <div className="font-semibold">₹ {transaction.toAmount.toFixed(2)}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-text-tertiary">No transactions found</div>
        )}
      </div>
    </div>
  )
}

