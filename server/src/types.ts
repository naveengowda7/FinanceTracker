export type TransactionType = 'income' | 'expense'

export type Category = | 'Food & Dining' | 'Shopping' | 'Transportation' | 'Entertainment' | 'Transfer' | 'Utilities' | 'Housing' | 'Healthcare' | 'Education' | 'Salary' | 'Investment' | 'Other'

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'received'

export interface Transaction {
  id:string
  date:string
  description:string
  category:Category
  amount:number
  type:TransactionType
  status:TransactionStatus
  account:string
  note:string

}

export interface Summary {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  savingsRate:number
  balanceTrend:{month:string; balance:number}[]
  cashflow:{month:string;income:number;expenses:number}[]
  categoryBreakdown: {category:string; amount:number}[]
}