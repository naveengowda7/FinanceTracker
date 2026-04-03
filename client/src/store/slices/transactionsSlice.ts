import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export interface Transaction {
  id:string
  date:string
  description:string
  category:string
  amount:number
  type:'income'|'expense'
  status:'completed'|'pending'|'failed'|'received'
  account:string
  note:string
}

interface TransactionState {
  data: Transaction[]
  loading: boolean
  error: string | null
}

const initialState: TransactionState = {
  data:[],
  loading: false,
  error:null
}

export const fetchTransactions = createAsyncThunk('transactions/fetchAll',
  async(params: Record<string, string> = {}, {rejectWithValue}) => {
    try{
      const query = new URLSearchParams(params).toString()
      const res = await axios.get(`${API}/transactions${query ? `?${query}`:''}`)
      return res.data as Transaction[]
    } catch(err:any){
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions')
    }
  }
)

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (payload: Omit<Transaction, 'id'>,{rejectWithValue})=>{
    try{
      const res = await axios.post(`${API}/transactions`,payload)
      return res.data as Transaction
    }catch (err:any){
      return rejectWithValue(err.response?.data?.message || 'Failed to add Transaction')
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async({id,data}:{id:string; data:Partial<Transaction>},{rejectWithValue})=>{
    try{const res = await axios.patch(`${API}/transactions/${id}`,data)
    return res.data as Transaction}catch(err:any){
      return rejectWithValue(err.response?.data?.message || 'Failed to update Transaciton')
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async(id:string, {rejectWithValue})=>{
    try{
      await axios.delete(`${API}/transactions/${id}`)
      return id
    }catch(err:any){
      return rejectWithValue(err.reponse?.data?.message || 'Failed to delete Transaction')
    }
  }
)

const transactionSlice = createSlice({
  name:'transactions',
  initialState,
  reducers:{},
  extraReducers:(builder) =>{
    builder
    .addCase(fetchTransactions.pending, (state)=>{
      state.loading = true
      state.error = null
    })
    .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>)=>{
      state.loading = false
      state.data = action.payload
    })
    .addCase(fetchTransactions.rejected, (state,action)=>{
      state.loading = false
      state.error = action.payload as string
    })
    .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>)=>{
      state.data.unshift(action.payload)
    })
    .addCase(updateTransaction.fulfilled, (state,action:PayloadAction<Transaction>)=>{
      const index = state.data.findIndex(t => t.id === action.payload.id)
      if(index != -1) state.data[index] = action.payload
    })
    .addCase(deleteTransaction.fulfilled, (state, action:PayloadAction<string>)=>{
      state.data = state.data.filter(t => t.id !== action.payload)
    })
  }
})

/*
 I have not made a real API request to ADD, UPDATE, DELETE the transaction, as it will reflect the changes onto the static mock data stored in the backend
 */ 

export default transactionSlice.reducer