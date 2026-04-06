import {configureStore} from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice'
import filtersReducer from './slices/filterSlice'
import transactionsReducer from './slices/transactionsSlice'
import roleReducer from "./slices/roleSlice"
import summaryReducer from './slices/summarySlice'

export const store = configureStore({
  reducer:{
  ui:uiReducer,
  transactions: transactionsReducer,
  filters: filtersReducer,
  role:roleReducer,
  summary:summaryReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch