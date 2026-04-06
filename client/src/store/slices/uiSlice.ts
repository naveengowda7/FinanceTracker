import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean
  modalOpen: boolean
  editingTransactionId: string | null
  isDark: boolean
}

const initialState: UiState = {
  sidebarOpen: true,
  modalOpen: false,
  editingTransactionId: null,
  isDark: true,
}

const uiSlice = createSlice({
  name:'ui',
  initialState,
  reducers:{
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    toggleDarkMode:(state) =>{
      state.isDark = !state.isDark
    },
    openModal: (state, action: PayloadAction<string | null>)=>{
      state.modalOpen = true
      state.editingTransactionId = action.payload
    },
    closeModal: (state) =>{
      state.modalOpen = false
      state.editingTransactionId = null
    }
  }
})

export const {toggleSidebar, openModal, closeModal, toggleDarkMode} = uiSlice.actions
export default uiSlice.reducer