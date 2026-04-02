import { transactions } from './../mockData.js';
import {Router} from 'express'
import type { Request, Response } from 'express'

const router = Router();

router.get('/', (req:Request, res:Response)=>{
  const totalIncome = transactions.filter(t => t.type === 'income')
  .reduce((sum, t)=> sum + t.amount,0)

  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum,t)=> sum+t.amount,0)

  const totalBalance = totalIncome + totalExpenses;

  const savingsRate = Math.round((totalBalance / totalIncome)*100)

  const monthMap: Record<string, {income:number; expenses:number}> = {}

  transactions.forEach(t=>{
    const month = t.date.slice(0,7)
    if(!monthMap[month]) monthMap[month] = {income:0, expenses:0}
    if(t.type === 'income') monthMap[month].income += t.amount
    else monthMap[month].expenses += t.amount
  })

  const cashflow = Object.entries(monthMap).sort(([a],[b])=>a.localeCompare(b)).map(([month,values])=>({
    month, ...values
  }))

  let running = 0
  const balanceTrend = cashflow.map(({month, income,expenses})=>{
    running += income - expenses
    return {month, balance:Math.round(running * 100)/100}
  })

  const catMap: Record<string, number> = {}
  transactions.filter(t => t.type ==='expense').forEach(t => {
    catMap[t.category] =( catMap[t.category] || 0) + t.amount
  })

  const categoryBreakdown = Object.entries(catMap).map(([category, amount])=> ({category, amount})).sort((a,b)=>b.amount - a.amount)

  res.json({
    totalBalance,
    totalIncome,
    totalExpenses,
    savingsRate,
    cashflow,
    balanceTrend,
    categoryBreakdown
  })
})

export default router