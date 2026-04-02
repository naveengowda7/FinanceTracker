import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import transactionsRouter from './routes/transactions.js'
import summaryRouter from './routes/summary.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET','POST','PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

app.get('/api/health',(req,res)=>{
  res.json({status:
    'ok', message:'Finance Track API is running'
  })
})

app.use('/api/transactions', transactionsRouter)
app.use('/api/summary', summaryRouter)

app.use((req,res)=>{
  res.status(404).json({message:"Route not found"})
})

app.listen(PORT, ()=>{
  console.log(`Finance Track server running on http://localhost:${PORT}`)
})