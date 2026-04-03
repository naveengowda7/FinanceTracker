import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean
  modalOpen: boolean
  editingTransactionId: string | null
}

const initialState: UiState = {
  sidebarOpen: true,
  modalOpen: false,
  editingTransactionId: null
}

const uiSlice = createSlice({
  name:'ui',
  initialState,
  reducers:{
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
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

export const {toggleSidebar, openModal, closeModal} = uiSlice.actions
export default uiSlice.reducer