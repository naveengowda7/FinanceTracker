import {createSlice, type PayloadAction} from "@reduxjs/toolkit"

type Role = 'admin' | 'viewer'

interface Rolestate {
  current: Role
}

const saved = localStorage.getItem('user_role') as Role | null

const initialState: Rolestate = {
  current: saved || 'viewer'
}

const roleSlice = createSlice({
  name:'role',
  initialState,
  reducers:{
    setRole: (state, action:PayloadAction<Role>)=>{
      state.current = action.payload
      localStorage.setItem('user_role',action.payload)
    }
  }

})

export const {setRole} = roleSlice.actions
export default roleSlice.reducer