import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit"
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

interface SummaryState{
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  savingsRate: number
  cashflow: { month: string; income: number; expenses: number }[]
  balanceTrend: { month: string; balance: number }[]
  categoryBreakdown: { category: string; amount: number }[]
  loading: boolean
  error: string | null
}

const initialState: SummaryState = {
  totalBalance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  savingsRate: 0,
  cashflow: [],
  balanceTrend: [],
  categoryBreakdown: [],
  loading: false,
  error: null
}

export const fetchSummary = createAsyncThunk(
  'summary/fetch',
  async(_, {rejectWithValue})=>{
    try{
      const res = await axios.get(`${API}/summary`)
      return res.data
    }catch(err:any){
      return rejectWithValue('Failed to fetch summary')
    }
  }
)

const summarySlice = createSlice({
  name:'summary',
  initialState,
  reducers:{},
  extraReducers(builder) {
    builder
    .addCase(fetchSummary.pending, (state)=>{
      state.loading = true
      state.error = null
    })
    .addCase(fetchSummary.fulfilled, (state,action:PayloadAction<SummaryState>)=>{
      state.loading = false
      Object.assign(state, action.payload)
    })
     .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default summarySlice.reducer