import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"

interface FiltersState {
  type: 'all' | 'income' | 'expense'
  category: string
  status: string
  month: string
  search:string
}

const initialState : FiltersState = {
  type: 'all',
  category: 'all',
  status: 'all',
  month: '',
  search: ''
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers:{
    setFilter : (state, action:PayloadAction<{key: keyof FiltersState;value:string}>)=>{
      const {key, value} = action.payload;
      (state as any)[key] = value
    },
    resetFilters: () => initialState
  }
})

export const {setFilter, resetFilters} = filterSlice.actions;
export default filterSlice.reducer